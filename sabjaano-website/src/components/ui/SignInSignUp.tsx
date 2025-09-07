"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
// MODIFICATION: Removed the unused Footer import
// import Footer from "@/components/ui/Footer";

// --- Google Icon SVG Component ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44.5 24c0-1.52-.14-3-.4-4.43H24v8.51h11.3c-.48 2.76-1.92 5.08-4.11 6.7v5.51h7.07c4.14-3.82 6.51-9.47 6.51-16.29z" fill="#4285F4"/>
        <path d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.07-5.51c-2.15 1.45-4.92 2.3-8.82 2.3-6.8 0-12.55-4.58-14.63-10.73H1.31v5.71C5.27 42.4 13.99 48 24 48z" fill="#34A853"/>
        <path d="M9.37 28.62c-.45-1.35-.7-2.78-.7-4.27s.25-2.92.7-4.27V14.4H1.31C.48 16.53 0 18.96 0 21.5s.48 4.97 1.31 7.12l8.06-6.21z" fill="#FBBC05"/>
        <path d="M24 9.48c3.54 0 6.64 1.22 9.13 3.6l6.27-6.26C35.91 2.85 30.48 0 24 0 13.99 0 5.27 5.6 1.31 14.4l8.06 6.21C11.45 14.06 17.2 9.48 24 9.48z" fill="#EA4335"/>
    </svg>
);


export default function AuthPage() {
  const [formType, setFormType] = useState<"signin" | "signup">("signin");
  const router = useRouter();

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
        router.push("/"); // Redirect to homepage on success
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
            password: suPassword 
        }),
      });
      if (res.ok) {
        setFormType("signin"); // Switch to sign-in on success
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
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
             <motion.div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                backgroundImage:
                    "linear-gradient(-45deg,#00bcd4,rgb(236,128,255),#00c853,#ffd600,#1e90ff,#ff4081)",
                backgroundSize: "600% 600%",
                }}
                animate={{
                backgroundPosition: [ "0% 50%", "50% 50%", "100% 50%", "50% 50%", "0% 50%", ],
                }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
        </div>
        
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-gray-700"
        >
            <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-purple-600/50 to-blue-600/50">
                <h2 className="text-3xl font-bold mb-4">
                    {formType === 'signin' ? "Welcome Back!" : "Join Us Today!"}
                </h2>
                <p className="text-purple-200">
                    {formType === 'signin' 
                        ? "Sign in to access your dashboard and manage your campaigns."
                        : "Create an account to start turning your ideas into profit."
                    }
                </p>
            </div>

            <div className="p-8 md:p-12">
                <Link href="/" className="absolute top-4 right-4 text-gray-400 hover:text-white transition-transform hover:scale-125">
                  <X size={24} />
                </Link>
                
                <div className="flex mb-6 border-b border-gray-700">
                    <button onClick={() => setFormType('signin')} className={`py-2 px-4 font-semibold ${formType === 'signin' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}>Sign In</button>
                    <button onClick={() => setFormType('signup')} className={`py-2 px-4 font-semibold ${formType === 'signup' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}>Sign Up</button>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={formType}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                  {formType === "signin" ? (
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
