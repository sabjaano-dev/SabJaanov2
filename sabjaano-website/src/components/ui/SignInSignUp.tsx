"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock } from "lucide-react";
import {
  sendOtp,
  resendOtp,
  verifyOtp,
  loginInit,
  loginWithPassword,
  registerWithEmailPassword,
  checkUserStatus,
  type AuthResponse,
} from "@/lib/api";

/**
 * Toggle to enforce “PW + OTP always”.
 * - true  → Flow (3): always require PW first, then OTP (even if OTP tab is selected, PW will be asked too)
 * - false → Flow (1) + Flow (2): user chooses either “Password” (then OTP) or “OTP only”
 */
const REQUIRE_OTP_AFTER_PASSWORD_ALWAYS = false;

interface SignInSignUpProps {
  modalType: "signin" | "signup";
  closeModal: () => void;
  onAuthSuccess: () => void;
  switchModal: (type: "signin" | "signup") => void;
}

const TOKEN_KEY = "sj_access_token";
const MAX_OTP_ATTEMPTS = 5;
const RESEND_SECONDS = 30;

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M44.5 24c0-1.52-.14-3-.4-4.43H24v8.51h11.3c-.48 2.76-1.92 5.08-4.11 6.7v5.51h7.07c4.14-3.82 6.51-9.47 6.51-16.29z" fill="#4285F4"/>
    <path d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.07-5.51c-2.15 1.45-4.92 2.3-8.82 2.3-6.8 0-12.55-4.58-14.63-10.73H1.31v5.71C5.27 42.4 13.99 48 24 48z" fill="#34A853"/>
    <path d="M9.37 28.62c-.45-1.35-.7-2.78-.7-4.27s.25-2.92.7-4.27V14.4H1.31C.48 16.53 0 18.96 0 21.5s.48 4.97 1.31 7.12l8.06-6.21z" fill="#FBBC05"/>
    <path d="M24 9.48c3.54 0 6.64 1.22 9.13 3.6l6.27-6.26C35.91 2.85 30.48 0 24 0 13.99 0 5.27 5.6 1.31 14.4l8.06 6.21C11.45 14.06 17.2 9.48 24 9.48z" fill="#EA4335"/>
  </svg>
);

/** Normalize email/phone */
function normIdentifier(id: string) {
  const s = id.trim();
  if (!s) return { kind: "unknown" as const } as any;
  if (/\D/.test(s)) return { kind: "email" as const, email: s.toLowerCase() };
  return { kind: "phone" as const, phone: s.replace(/\D/g, "") };
}

function maskIdentifier(id: string) {
  const { kind, email, phone } = normIdentifier(id);

  if (kind === "email" && email) {
    const [name = "", domain = ""] = email.split("@");
    const safeName = `${name.slice(0, 2)}…`;
    const safeDomain = (domain ?? "").replace(
      /^(.)(.*?)(\..*)$/,
      (_match: string, a: string, b: string, c: string) => `${a}${b ? "…" : ""}${c ?? ""}`
    );
    return `${safeName}@${safeDomain || "…"}`;
  }

  if (kind === "phone" && phone) {
    const tail = phone.slice(-4);
    return `••••••${tail}`;
  }

  return "your contact";
}

function friendly(err: any): string {
  const msg = (typeof err === "string" ? err : err?.message || "").toLowerCase();
  if (!msg) return "Something went wrong. Please try again.";
  if (msg.includes("invalid otp")) return "That code didn’t work. Please try again.";
  if (msg.includes("expired")) return "Code expired. Please request a new one.";
  if (msg.includes("too many") || msg.includes("rate")) return "Too many attempts. Please wait and retry.";
  if ((msg.includes("not found") || msg.includes("not exist")) && msg.includes("user")) return "No account found for this identifier.";
  if (msg.includes("email or phone required")) return "Please enter your email or phone.";
  return err?.message || "Request failed. Please try again.";
}

/** OTP input: 6 boxes with paste-to-fill */
function OtpBoxes({
  value,
  setValue,
  disabled,
}: {
  value: string;
  setValue: (v: string) => void;
  disabled?: boolean;
}) {
  const inputs = Array.from({ length: 6 });
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className="flex justify-between gap-2" aria-label="One-time passcode">
      {inputs.map((_, idx) => (
        <input
          key={idx}
          ref={(el: HTMLInputElement | null) => { refs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[idx] ?? ""}
          aria-label={`Digit ${idx + 1}`}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "");
            if (!d) {
              const next = value.substring(0, idx) + "" + value.substring(idx + 1);
              setValue(next);
              return;
            }
            const next = (value.substring(0, idx) + d[0] + value.substring(idx + 1)).slice(0, 6);
            setValue(next);
            if (idx < 5) refs.current[idx + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              if (value[idx]) {
                const next = value.substring(0, idx) + "" + value.substring(idx + 1);
                setValue(next);
              } else if (idx > 0) {
                refs.current[idx - 1]?.focus();
              }
            }
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (text) {
              setValue(text);
              refs.current[Math.min(text.length, 5)]?.focus();
              e.preventDefault();
            }
          }}
          className="w-12 h-12 text-center text-lg rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default function SignInSignUp({
  modalType,
  closeModal,
  onAuthSuccess,
  switchModal,
}: SignInSignUpProps) {
  /** tabs */
  const [tab, setTab] = useState<"signin" | "signup">(modalType);
  useEffect(() => setTab(modalType), [modalType]);

  /** ---- Sign-In state ---- */
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");          // email or phone (used by OTP flow)
  const [siEmail, setSiEmail] = useState("");                // email for PW step
  const [siPassword, setSiPassword] = useState("");          // password for PW step

  // password step
  const [siLoading, setSiLoading] = useState(false);
  const [siError, setSiError] = useState<string | null>(null);

  // OTP step (shared)
  const [otpUIVisible, setOtpUIVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /** ---- Sign-Up (Email+PW → OTP) ---- */
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suLoading, setSuLoading] = useState(false);
  const [suError, setSuError] = useState<string | null>(null);
  const [signupStep, setSignupStep] = useState<"form" | "otp">("form");
  const [suOtp, setSuOtp] = useState("");
  const [suOtpLoading, setSuOtpLoading] = useState(false);
  const [suOtpError, setSuOtpError] = useState<string | null>(null);
  const [suResendIn, setSuResendIn] = useState(0);
  const suTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [suOtpAttempts, setSuOtpAttempts] = useState(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (suTimerRef.current) clearInterval(suTimerRef.current);
    };
  }, []);

  const maskedSignInId = useMemo(() => (otpUIVisible ? maskIdentifier(identifier || siEmail) : ""), [otpUIVisible, identifier, siEmail]);
  const maskedSignUpId  = useMemo(() => (signupStep === "otp" ? maskIdentifier(suEmail) : ""), [signupStep, suEmail]);

  function storeTokenAndFinish(data: AuthResponse) {
    const token = data?.accessToken || data?.token || data?.data?.accessToken || data?.data?.token;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    onAuthSuccess();
    closeModal();
  }

  /** **************************************
   * SIGN-IN FLOWS
   * ************************************ */

  /** Flow (1)/(3): Password ➜ OTP */
  async function onSubmitPassword(e: React.FormEvent) {
    e.preventDefault();
    setSiLoading(true);
    setSiError(null);
    setOtpError(null);
    setOtp("");
    try {
      // Preferred: backend route that verifies PW and triggers OTP
      const res = await loginInit(siEmail.trim().toLowerCase(), siPassword);
      // If backend indicates success (otp sent or required), show OTP UI
      if (res?.otpRequired !== false) {
        setOtpUIVisible(true);
        setIdentifier(siEmail.trim().toLowerCase()); // used for verify
        startResendTimer();
      } else {
        // Fallback: if some backends log you in directly (shouldn’t for 2FA),
        // still force OTP by sending one now (Flow 3)
        await sendOtp({ email: siEmail.trim().toLowerCase() });
        setOtpUIVisible(true);
        setIdentifier(siEmail.trim().toLowerCase());
        startResendTimer();
      }
    } catch (err: any) {
      // if loginInit not available (404), we force “send + verify” to emulate 2FA
      const m = String(err?.message || "").toLowerCase();
      if (m.includes("404") || m.includes("not found")) {
        try {
          // Check PW by normal login, but DO NOT store token yet;
          // just use it as a password check, then send OTP.
          await loginWithPassword(siEmail.trim().toLowerCase(), siPassword);
          await sendOtp({ email: siEmail.trim().toLowerCase() });
          setOtpUIVisible(true);
          setIdentifier(siEmail.trim().toLowerCase());
          startResendTimer();
        } catch (err2: any) {
          setSiError(friendly(err2));
        }
      } else {
        setSiError(friendly(err));
      }
    } finally {
      setSiLoading(false);
    }
  }

  /** Flow (2): OTP-only Sign-In (identifier ➜ sendOtp ➜ verify) */
  async function sendSignInOtp() {
    setOtpError(null);
    setOtp("");
    const id = normIdentifier(identifier);
    if (id.kind !== "email" && id.kind !== "phone") {
      setOtpError("Enter email or phone first.");
      return;
    }
    try {
      setOtpLoading(true);
      const exists = await checkUserStatus(id);
      if (!exists) {
        setOtpError("No account found for this identifier. Please sign up first.");
        return;
      }
      await sendOtp(id);
      setOtpUIVisible(true);
      startResendTimer();
    } catch (e: any) {
      setOtpError(friendly(e));
    } finally {
      setOtpLoading(false);
    }
  }

  async function resendSignInOtp() {
    if (resendIn > 0) return;
    try {
      setOtpLoading(true);
      const id = identifier ? normIdentifier(identifier) : { email: siEmail.trim().toLowerCase() };
      await resendOtp(id as any);
      setResendIn(RESEND_SECONDS);
    } catch (e: any) {
      setOtpError(friendly(e));
    } finally {
      setOtpLoading(false);
    }
  }

  async function verifySignInOtp() {
    if (otpAttempts >= MAX_OTP_ATTEMPTS) {
      setOtpError("Too many attempts. Please wait and retry.");
      return;
    }
    const idObj =
      // If user came from password flow, `identifier` might be empty — use siEmail.
      identifier ? normIdentifier(identifier) : { kind: "email" as const, email: siEmail.trim().toLowerCase() };

    if ((idObj as any).kind !== "email" && (idObj as any).kind !== "phone") {
      setOtpError("Enter the 6-digit code.");
      return;
    }
    if (otp.length !== 6) {
      setOtpError("Enter the 6-digit code.");
      return;
    }
    try {
      setOtpLoading(true);
      const data = await verifyOtp({ ...(idObj as any), otp });
      storeTokenAndFinish(data);
    } catch (e: any) {
      setOtpAttempts((n) => n + 1);
      setOtpError(friendly(e));
    } finally {
      setOtpLoading(false);
    }
  }

  function startResendTimer() {
    setResendIn(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  /** **************************************
   * SIGN-UP: Email + Password → Email OTP
   * ************************************ */
  async function onSubmitSignUp(e: React.FormEvent) {
    e.preventDefault();
    setSuLoading(true);
    setSuError(null);
    setSuOtp("");
    try {
      await registerWithEmailPassword(suEmail.trim().toLowerCase(), suPassword);
      setSignupStep("otp");
      // fire OTP + timer
      try {
        await sendOtp({ email: suEmail.trim().toLowerCase() });
      } catch {
        // retry once
        await new Promise((r) => setTimeout(r, 600));
        try { await sendOtp({ email: suEmail.trim().toLowerCase() }); } catch (err2) { setSuOtpError(friendly(err2)); }
      }
      setSuResendIn(RESEND_SECONDS);
      if (suTimerRef.current) clearInterval(suTimerRef.current);
      suTimerRef.current = setInterval(() => {
        setSuResendIn((s) => {
          if (s <= 1) { if (suTimerRef.current) clearInterval(suTimerRef.current); return 0; }
          return s - 1;
        });
      }, 1000);
    } catch (err: any) {
      setSuError(friendly(err));
    } finally {
      setSuLoading(false);
    }
  }

  async function resendSignUpOtp() {
    if (suResendIn > 0) return;
    try {
      setSuOtpLoading(true);
      await resendOtp({ email: suEmail.trim().toLowerCase() });
      setSuResendIn(RESEND_SECONDS);
    } catch (e: any) {
      setSuOtpError(friendly(e));
    } finally {
      setSuOtpLoading(false);
    }
  }

  async function verifySignUpOtp() {
    if (suOtpAttempts >= MAX_OTP_ATTEMPTS) {
      setSuOtpError("Too many attempts. Please wait and retry.");
      return;
    }
    if (suOtp.length !== 6) {
      setSuOtpError("Enter the 6-digit code.");
      return;
    }
    try {
      setSuOtpLoading(true);
      const data = await verifyOtp({ email: suEmail.trim().toLowerCase(), otp: suOtp });
      const token = data?.accessToken || data?.token || data?.data?.accessToken || data?.data?.token;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        onAuthSuccess();
        closeModal();
        return;
      }
      // Fallback: login with password if verify didn’t return token
      const login = await loginWithPassword(suEmail.trim().toLowerCase(), suPassword);
      storeTokenAndFinish(login);
    } catch (e: any) {
      setSuOtpAttempts((n) => n + 1);
      setSuOtpError(friendly(e));
    } finally {
      setSuOtpLoading(false);
    }
  }

  /** **************************************
   * UI
   * ************************************ */
  return (
    <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeModal} role="dialog" aria-modal="true">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gray-800/80 rounded-2xl shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left pane */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-purple-600/50 to-blue-600/50">
          <h2 className="text-3xl font-bold mb-4">{tab === "signin" ? "Welcome Back!" : "Join Us Today!"}</h2>
          <p className="text-purple-200">
            {tab === "signin"
              ? "Sign in to access your dashboard and manage your campaigns."
              : "Create an account to start turning your ideas into profit."}
          </p>
        </div>

        {/* Right pane */}
        <div className="p-8 md:p-12">
          <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-transform hover:scale-125" aria-label="Close">
            <X size={24} />
          </button>

          <div className="flex mb-6 border-b border-gray-700">
            <button
              onClick={() => { setTab("signin"); setAuthMethod("password"); setOtpUIVisible(false); setOtp(""); setSiError(null); setOtpError(null); }}
              className={`py-2 px-4 font-semibold ${tab === "signin" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white"}`}
            >Sign In</button>
            <button
              onClick={() => { setTab("signup"); setSignupStep("form"); }}
              className={`py-2 px-4 font-semibold ${tab === "signup" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white"}`}
            >Sign Up</button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${tab}-${signupStep}-${authMethod}-${otpUIVisible}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "signin" ? (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Login to Your Account</h3>

                  <div className="flex justify-center gap-4 mb-6">
                    <button type="button" className="flex items-center justify-center gap-2 w-full bg-white text-black py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition" onClick={() => alert("Google Sign-In coming soon")}>
                      <GoogleIcon /> Sign in with Google
                    </button>
                  </div>

                  {!REQUIRE_OTP_AFTER_PASSWORD_ALWAYS && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <button
                        onClick={() => { setAuthMethod("password"); setOtpUIVisible(false); setOtp(""); setSiError(null); setOtpError(null); }}
                        className={`py-2 rounded-lg font-semibold ${authMethod === "password" ? "bg-cyan-500 text-white" : "bg-gray-700/60 text-gray-200"}`}
                      >Password</button>
                      <button
                        onClick={() => { setAuthMethod("otp"); setOtpUIVisible(false); setOtp(""); setSiError(null); setOtpError(null); }}
                        className={`py-2 rounded-lg font-semibold ${authMethod === "otp" ? "bg-cyan-500 text-white" : "bg-gray-700/60 text-gray-200"}`}
                      >OTP</button>
                    </div>
                  )}

                  {/* PASSWORD FIRST (Flow 1 / 3) */}
                  {(authMethod === "password" || REQUIRE_OTP_AFTER_PASSWORD_ALWAYS) && !otpUIVisible && (
                    <>
                      {siError && <div className="mb-4 text-red-400 bg-red-900/50 p-3 rounded-lg">{siError}</div>}
                      <form onSubmit={onSubmitPassword} className="space-y-4">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="email"
                            placeholder="Email"
                            required
                            value={siEmail}
                            onChange={(e) => setSiEmail(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                          />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="password"
                            placeholder="Password"
                            required
                            value={siPassword}
                            onChange={(e) => setSiPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                          />
                        </div>
                        <button type="submit" disabled={siLoading} className="w-full bg-cyan-500 text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50">
                          {siLoading ? "Continue…" : "Continue"}
                        </button>
                      </form>
                    </>
                  )}

                  {/* OTP STEP (either from PW → OTP, or OTP-only) */}
                  {(otpUIVisible || authMethod === "otp") && (
                    <>
                      {otpError && <div className="mb-4 text-red-400 bg-red-900/50 p-3 rounded-lg">{otpError}</div>}

                      {/* If OTP-only and OTP UI not visible yet, show identifier + Send */}
                      {authMethod === "otp" && !otpUIVisible && !REQUIRE_OTP_AFTER_PASSWORD_ALWAYS && (
                        <>
                          <div className="relative mb-3">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="text"
                              placeholder="Email or Phone"
                              value={identifier}
                              onChange={(e) => setIdentifier(e.target.value)}
                              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                            />
                          </div>
                          <button onClick={sendSignInOtp} disabled={otpLoading || !identifier.trim()} className="w-full bg-cyan-500 text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50">
                            {otpLoading ? "Sending OTP…" : "Send OTP"}
                          </button>
                        </>
                      )}

                      {/* OTP input */}
                      {(otpUIVisible || REQUIRE_OTP_AFTER_PASSWORD_ALWAYS) && (
                        <>
                          <p className="text-sm text-gray-400 mb-3">
                            We sent a 6-digit code to <span className="text-cyan-300">{maskedSignInId}</span>.
                          </p>

                          <OtpBoxes value={otp} setValue={setOtp} disabled={otpLoading} />

                          <div className="flex items-center justify-between mt-3 text-sm">
                            <span className="text-gray-400">{resendIn > 0 ? `Resend in ${resendIn}s` : "Didn't get the code?"}</span>
                            <button onClick={resendSignInOtp} disabled={resendIn > 0 || otpLoading} className="text-cyan-400 hover:underline disabled:opacity-50">
                              Resend OTP
                            </button>
                          </div>

                          <button onClick={verifySignInOtp} disabled={otpLoading || otp.length !== 6} className="w-full mt-4 bg-cyan-500 text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50">
                            {otpLoading ? "Verifying…" : "Verify & Sign In"}
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              ) : signupStep === "form" ? (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Create a New Account</h3>
                  {suError && <div className="mb-4 text-red-400 bg-red-900/50 p-3 rounded-lg">{suError}</div>}
                  <form onSubmit={onSubmitSignUp} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        value={suEmail}
                        onChange={(e) => setSuEmail(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="password"
                        placeholder="Password"
                        required
                        value={suPassword}
                        onChange={(e) => setSuPassword(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                    <button type="submit" disabled={suLoading} className="w-full bg-cyan-500 text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50">
                      {suLoading ? "Creating Account…" : "Create Account"}
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Verify your email</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    We’ve sent a 6-digit code to <span className="text-cyan-300">{maskedSignUpId}</span>.
                  </p>
                  {suOtpError && <div className="mb-4 text-red-400 bg-red-900/50 p-3 rounded-lg">{suOtpError}</div>}

                  <OtpBoxes value={suOtp} setValue={setSuOtp} disabled={suOtpLoading} />

                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-gray-400">{suResendIn > 0 ? `Resend in ${suResendIn}s` : "Didn't get the code?"}</span>
                    <button onClick={resendSignUpOtp} disabled={suResendIn > 0 || suOtpLoading} className="text-cyan-400 hover:underline disabled:opacity-50">
                      Resend OTP
                    </button>
                  </div>

                  <button onClick={verifySignUpOtp} disabled={suOtpLoading || suOtp.length !== 6} className="w-full mt-4 bg-cyan-500 text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50">
                    {suOtpLoading ? "Verifying…" : "Verify & Continue"}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
