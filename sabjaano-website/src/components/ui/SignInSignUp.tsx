"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, Image } from "lucide-react";

// --- Props Interface ---
// Defines the properties the component will accept from its parent (the hero component)
interface SignInSignUpProps {
  modalType: "signin" | "signup";
  closeModal: () => void;
  onAuthSuccess: () => void;
  switchModal: (type: "signin" | "signup") => void;
}

// --- Google Icon SVG Component ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44.5 24c0-1.52-.14-3-.4-4.43H24v8.51h11.3c-.48 2.76-1.92 5.08-4.11 6.7v5.51h7.07c4.14-3.82 6.51-9.47 6.51-16.29z" fill="#4285F4"/>
        <path d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.07-5.51c-2.15 1.45-4.92 2.3-8.82 2.3-6.8 0-12.55-4.58-14.63-10.73H1.31v5.71C5.27 42.4 13.99 48 24 48z" fill="#34A853"/>
        <path d="M9.37 28.62c-.45-1.35-.7-2.78-.7-4.27s.25-2.92.7-4.27V14.4H1.31C.48 16.53 0 18.96 0 21.5s.48 4.97 1.31 7.12l8.06-6.21z" fill="#FBBC05"/>
        <path d="M24 9.48c3.54 0 6.64 1.22 9.13 3.6l6.27-6.26C35.91 2.85 30.48 0 24 0 13.99 0 5.27 5.6 1.31 14.4l8.06 6.21C11.45 14.06 17.2 9.48 24 9.48z" fill="#EA4335"/>
    </svg>
);

// --- Main Component ---
const SignInSignUp: React.FC<SignInSignUpProps> = ({ modalType, closeModal, onAuthSuccess, switchModal }) => {
  // Sign-In form state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siError, setSiError] = useState<string | null>(null);
  const [siLoading, setSiLoading] = useState(false);

  // Sign-Up form state
  const [suFirstName, setSuFirstName] = useState("");
  const [suLastName, setSuLastName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirmPassword, setSuConfirmPassword] = useState("");
  const [suPhoneNumber, setSuPhoneNumber] = useState("");
  const [suAvatarUrl, setSuAvatarUrl] = useState("");
  const [suError, setSuError] = useState<string | null>(null);
  const [suLoading, setSuLoading] = useState(false);

  const handleSiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiLoading(true);
    setSiError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: siEmail, password: siPassword }),
      });
      if (res.ok) {
        onAuthSuccess(); // Notify parent of success
        closeModal();    // Close the modal
        return;
      }
      const body = await res.json().catch(() => ({}));
      setSiError(body.error || `Login failed (${res.status})`);
    } catch {
      setSiError("Network error");
    } finally {
      setSiLoading(false);
    }
  };

  const handleSuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (suPassword !== suConfirmPassword) {
      setSuError("Passwords do not match.");
      return;
    }
    setSuLoading(true);
    setSuError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            firstname: suFirstName, 
            lastname: suLastName, 
            email: suEmail, 
            password: suPassword,
            phone: suPhoneNumber,
            avatar: suAvatarUrl,
        }),
      });
      if (res.ok) {
        switchModal("signin"); // Switch to sign-in on success
        return;
      }
      const body = await res.json().catch(() => ({}));
      setSuError(body.error || `Signup failed (${res.status})`);
    } catch {
      setSuError("Network error");
    } finally {
      setSuLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeModal}>
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gray-800/80 rounded-2xl shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-gray-700"
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
        >
            <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-purple-600/50 to-blue-600/50">
                <h2 className="text-3xl font-bold mb-4">
                    {modalType === 'signin' ? "Welcome Back!" : "Join Us Today!"}
                </h2>
                <p className="text-purple-200">
                    {modalType === 'signin' 
                        ? "Sign in to access your dashboard and manage your campaigns."
                        : "Create an account to start turning your ideas into profit."
                    }
                </p>
            </div>

            <div className="p-8 md:p-12">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-transform hover:scale-125">
                  <X size={24} />
                </button>
                
                <div className="flex mb-6 border-b border-gray-700">
                    <button onClick={() => switchModal('signin')} className={`py-2 px-4 font-semibold ${modalType === 'signin' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}>Sign In</button>
                    <button onClick={() => switchModal('signup')} className={`py-2 px-4 font-semibold ${modalType === 'signup' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}>Sign Up</button>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={modalType}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                  {modalType === "signin" ? (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">Login to Your Account</h3>
                       <div className="flex justify-center gap-4 mb-6">
                           <button className="flex items-center justify-center gap-2 w-full bg-white text-black py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition">
                               <GoogleIcon /> Sign in with Google
                           </button>
                       </div>
                       <div className="text-center text-gray-500 my-4">OR</div>
                      {siError && <div className="mb-4 text-red-400 bg-red-900/50 p-3 rounded-lg">{siError}</div>}
                      <form onSubmit={handleSiSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                            <input type="email" placeholder="Email" required value={siEmail} onChange={(e) => setSiEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                            <input type="password" placeholder="Password" required value={siPassword} onChange={(e) => setSiPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                        <button type="submit" disabled={siLoading} className="w-full bg-cyan-500 text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50">{siLoading ? "Signing in…" : "Sign In"}</button>
                      </form>
                      <div className="mt-4 text-right text-sm">
                        <button className="text-cyan-400 hover:underline">Forgot Password?</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Create a New Account</h3>
                        {suError && <div className="mb-4 text-red-400 bg-red-900/50 p-3 rounded-lg">{suError}</div>}
                        <form onSubmit={handleSuSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                                    <input type="text" placeholder="First Name" required value={suFirstName} onChange={(e) => setSuFirstName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                                    <input type="text" placeholder="Last Name" required value={suLastName} onChange={(e) => setSuLastName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                </div>
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                                <input type="email" placeholder="Email" required value={suEmail} onChange={(e) => setSuEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                                <input type="password" placeholder="Password" required value={suPassword} onChange={(e) => setSuPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                                <input type="password" placeholder="Confirm Password" required value={suConfirmPassword} onChange={(e) => setSuConfirmPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                             <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                                <input type="tel" placeholder="Phone Number (Optional)" value={suPhoneNumber} onChange={(e) => setSuPhoneNumber(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <div className="relative">
                                <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                                <input type="text" placeholder="Avatar URL (Optional)" value={suAvatarUrl} onChange={(e) => setSuAvatarUrl(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <button type="submit" disabled={suLoading} className="w-full bg-cyan-500 text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50">{suLoading ? "Creating Account…" : "Create Account"}</button>
                        </form>
                    </div>
                  )}
                  </motion.div>
                </AnimatePresence>
              </div>
        </motion.div>
    </div>
  );
}

export default SignInSignUp;

