'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Facebook } from 'lucide-react'
import { FaGoogle } from 'react-icons/fa';

export default function SignInModal() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/');
        return;
      }
      setError((await res.json()).error || 'Login failed');
    } catch {
      setError('Network error – please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        {/* Close button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
        <p className="text-center text-gray-500 mb-6">with</p>
<div className="flex justify-center gap-4 mb-6">
  <button className="bg-blue-600 text-white p-3 rounded-full hover:opacity-90">
    <Facebook size={20} />
  </button>
  <button className="bg-red-600 text-white p-3 rounded-full hover:opacity-90">
    <FaGoogle size={20} />
  </button>
</div>


        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm text-gray-600">
          <Link href="/signup" className="hover:underline">
            New Here? Sign Up
          </Link>
          <Link href="/forgot" className="hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
