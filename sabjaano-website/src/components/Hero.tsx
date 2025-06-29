'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, ShoppingBag, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function StripeHero() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modalType, setModalType] = useState<'signin' | 'signup' | null>(null);

  // Sign-In form state
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siError, setSiError] = useState<string | null>(null);
  const [siLoading, setSiLoading] = useState(false);

  // Sign-Up form state
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suError, setSuError] = useState<string | null>(null);
  const [suLoading, setSuLoading] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // detect login status
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    router.push('/');
  };

  const openSignIn = () => {
    setModalType('signin');
    setSiError(null);
  };
  const openSignUp = () => {
    setModalType('signup');
    setSuError(null);
  };
  const closeModal = () => {
    setModalType(null);
    setSiError(null);
    setSuError(null);
  };

  const handleSiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiLoading(true);
    setSiError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email: siEmail, password: siPassword }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        closeModal();
        return;
      }
      const body = await res.json().catch(()=>({}));
      setSiError(body.error || `Login failed (${res.status})`);
    } catch {
      setSiError('Network error');
    } finally {
      setSiLoading(false);
    }
  };

  const handleSuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuLoading(true);
    setSuError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email: suEmail, password: suPassword }),
      });
      if (res.ok) {
        // after signup, open sign-in
        setModalType('signin');
        return;
      }
      const body = await res.json().catch(()=>({}));
      setSuError(body.error || `Signup failed (${res.status})`);
    } catch {
      setSuError('Network error');
    } finally {
      setSuLoading(false);
    }
  };

  const navItems = [
    { label: 'Products', menu: ['Ad Formats','Analytics','Billing'] },
    {
      label: 'Solutions', mega: true,
      content: [
        { title:'By Stage', items:['Enterprises','Startups'] },
        { title:'By Industry', items:['E-commerce','Retail','SaaS','Platforms'] },
        { title:'By Use Case', items:['Fintech','Real Estate','Events','D2C'] },
      ],
    },
    { label:'Developers', menu:['API Docs','Webhooks','SDKs'] },
    { label:'Resources',  menu:['Blog','Guides','Help Center'] },
    { label:'Pricing',    menu:['Plans','FAQs'] },
  ];

  const handleMouseEnter = (i:number) => {
    if(timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(i);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(()=>setOpenIndex(null),150);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated Gradient */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[75vh] z-0"
        style={{
          clipPath:'polygon(0 0,100% 0,100% 70%,0 100%)',
          backgroundImage:
            'linear-gradient(-45deg,#00bcd4,rgb(236,128,255),#00c853,#ffd600,#1e90ff,#ff4081)',
          backgroundSize:'600% 600%',
        }}
        animate={{ backgroundPosition:['0% 50%','50% 50%','100% 50%','50% 50%','0% 50%'] }}
        transition={{duration:30,repeat:Infinity,ease:'easeInOut'}}
      />

      {/* Content */}
      <div className="relative z-10 px-6 lg:px-24">
        {/* Navbar */}
        <header className="flex items-center justify-between py-6 text-white text-sm font-semibold">
          <div className="flex items-center gap-12">
            <h1 className="text-2xl font-bold tracking-tight">SabJaano</h1>
            <nav className="hidden md:flex gap-14 font-semibold text-white text-base">
              {navItems.map((nav,idx)=>(
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={()=>handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>{nav.label}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openIndex===idx?'rotate-180':''
                      }`}
                    />
                  </div>
                  {/* dropdowns */}
                  {!nav.mega&&openIndex===idx&&nav.menu&&(
                    <div className="absolute left-0 mt-3 w-44 bg-white text-black rounded-lg shadow-xl z-50">
                      <ul className="p-2 space-y-1 text-sm font-medium">
                        {nav.menu.map((item,i)=>(
                          <li key={i} className="hover:bg-gray-100 px-3 py-1 rounded">
                            <a href="#">{item}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {nav.mega&&openIndex===idx&&nav.content&&(
                    <div className="absolute left-0 mt-6 w-[700px] bg-white text-black rounded-xl shadow-2xl z-50 p-6 grid grid-cols-3 gap-6">
                      {nav.content.map((sec,sIdx)=>(
                        <div key={sIdx}>
                          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                            {sec.title}
                          </h4>
                          <ul className="space-y-2 text-sm font-medium">
                            {sec.items.map((it,i2)=>(
                              <li key={i2} className="hover:bg-gray-100 rounded px-2 py-1">
                                <a href="#">{it}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right nav */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-red-600 font-semibold">
                Logout
              </button>
            ) : (
              <button
                onClick={openSignIn}
                className="transform transition-transform duration-200 ease-in-out hover:scale-110"
              >
                Sign in
              </button>
            )}

            <button className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-5 py-1.5 text-sm font-semibold flex items-center gap-2">
              Contact sales <ChevronDown className="w-4 h-4" />
            </button>
            <Search className="h-4 w-4" />
            <ShoppingBag className="h-5 w-5" />
            <Menu className="h-5 w-5 md:hidden" />
          </div>
        </header>

        {/* Hero text */}
        <section className="grid grid-cols-1 lg:grid-cols-2 items-center pt-24 pb-12 gap-12 min-h-screen">
          <div className="max-w-xl text-white lg:text-left text-left">
            <h2 className="text-[4.9rem] lg:text-[6rem] font-extrabold leading-[1] tracking-[-0.05em] relative inline-block">
              <span className="relative z-10 text-black/90">
                Real-World <span className="text-white">Advertising</span><br/>
                Smarter<span className="text-black">&amp; Sharper</span>
              </span>
            </h2>
            <p className="mt-6 text-lg lg:text-xl text-black/90 max-w-lg">
              🎯 72% average uplift in QR scan-to-conversion<br/>
              🧠 50% lower cost-per-lead vs digital ads<br/>
              📍 900+ high-footfall locations activated
            </p>
            <button className="mt-6 bg-[#0f172a] text-white rounded-full px-6 py-3 text-sm hover:bg-black">
              Request an invite
            </button>
          </div>
        </section>
      </div>

      {/* SIGN-IN / SIGN-UP MODAL */}
      {modalType && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            {/* close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>

            {modalType === 'signin' ? (
              <>
                <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
                <p className="text-center text-gray-500 mb-6">with</p>
                <div className="flex justify-center gap-4 mb-6">
                  <button className="bg-blue-600 text-white p-3 rounded-full hover:opacity-90">
                    {/* Facebook icon */}
                    <Menu size={20}/>
                  </button>
                  <button className="bg-red-600 text-white p-3 rounded-full hover:opacity-90">
                    {/* Google icon */}
                    <ChevronDown size={20}/>
                  </button>
                </div>
                {siError && (
                  <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{siError}</div>
                )}
                <form onSubmit={handleSiSubmit} className="space-y-4">
                  <input
                    type="email" placeholder="Email" required
                    value={siEmail} onChange={e=>setSiEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="password" placeholder="Password" required
                    value={siPassword} onChange={e=>setSiPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  <button
                    type="submit" disabled={siLoading}
                    className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition disabled:opacity-50"
                  >
                    {siLoading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
                <div className="mt-6 flex justify-between text-sm text-gray-600">
                  <button onClick={openSignUp} className="hover:underline">
                    New Here? Sign Up
                  </button>
                  <button onClick={()=>{/* forgot… */}} className="hover:underline">
                    Forgot Password?
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
                <p className="text-center text-gray-500 mb-6">with</p>
                <div className="flex justify-center gap-4 mb-6">
                  <button className="bg-blue-600 text-white p-3 rounded-full hover:opacity-90">
                    <Menu size={20}/>
                  </button>
                  <button className="bg-red-600 text-white p-3 rounded-full hover:opacity-90">
                    <ChevronDown size={20}/>
                  </button>
                </div>
                {suError && (
                  <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{suError}</div>
                )}
                <form onSubmit={handleSuSubmit} className="space-y-4">
                  <input
                    type="email" placeholder="Email" required
                    value={suEmail} onChange={e=>setSuEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="password" placeholder="Password" required
                    value={suPassword} onChange={e=>setSuPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  <button
                    type="submit" disabled={suLoading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {suLoading ? 'Registering…' : 'Register'}
                  </button>
                </form>
                <div className="mt-6 text-center text-sm">
                  Already have an account?{' '}
                  <button onClick={openSignIn} className="hover:underline">
                    Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
