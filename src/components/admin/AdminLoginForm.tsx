'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { getSafeRedirectPath } from '@/lib/security';
import { apiFetch } from '@/lib/admin-api';
import { useToast } from '@/components/admin/useToast';

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, Toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClassName =
    'w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-900 focus:ring-2 focus:ring-[#012D26] focus:border-transparent outline-none';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      showToast('Signed in successfully', 'success');
      const from = getSafeRedirectPath(searchParams.get('from'));
      router.push(from);
      router.refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {Toast}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#012D26] to-green-900 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#012D26] mb-2">Admin Login</h1>
          <p className="text-gray-500 mb-8">Uncle Westiee Studios CMS</p>

          <form onSubmit={handleSubmit} className="space-y-5" aria-label="Admin login form">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  minLength={8}
                  className={`${inputClassName} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 hover:text-[#012D26] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#012D26] text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
