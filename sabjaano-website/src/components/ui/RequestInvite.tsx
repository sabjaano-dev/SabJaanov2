"use client";

import { useState } from 'react';
import { User, Building, Mail, Phone, Send } from 'lucide-react';

export default function RequestInvitePage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to your API
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  return (
    <>
      <style jsx global>{`
        /* --- AURORA GRADIENT BACKGROUND --- */
        @keyframes fluidAnimation {
          0% { background-position: 0% 50%, 50% 50%, 100% 50%; }
          50% { background-position: 100% 50%, 0% 50%, 50% 100%; }
          100% { background-position: 0% 50%, 50% 50%, 100% 50%; }
        }
        .aurora-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }
        .aurora-bg::after {
          content: "";
          position: absolute;
          inset: -200px;
          background-image:
            radial-gradient(at 10% 20%, hsla(259, 94%, 26%, 0.3) 0px, transparent 40%),
            radial-gradient(at 80% 30%, hsla(289, 87%, 35%, 0.3) 0px, transparent 40%),
            radial-gradient(at 20% 90%, hsla(308, 92%, 38%, 0.3) 0px, transparent 40%),
            radial-gradient(at 90% 80%, hsla(269, 88%, 28%, 0.3) 0px, transparent 40%);
          background-size: 150% 150%;
          animation: fluidAnimation 30s ease-in-out infinite;
          filter: blur(60px);
        }
      `}</style>
      <div className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 overflow-hidden">
        {/* Moving Gradient Background */}
        <div className="aurora-bg" />
        
        <div className="relative z-10 w-full max-w-lg">
          {isSubmitted ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center backdrop-blur-sm">
              <h1 className="text-3xl font-bold text-cyan-400 mb-4">Thank You!</h1>
              <p className="text-gray-300">
                Your request has been received. Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
              <h1 className="text-3xl font-bold text-center mb-2">Request a Demo</h1>
              <p className="text-gray-400 text-center mb-8">
                See how SabJaano can revolutionize your business.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Input */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  />
                </div>

                {/* Company Name Input */}
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Work Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  />
                </div>

                {/* Phone Number Input */}
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition"
                >
                  <Send size={18} />
                  Send Invite Request
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
