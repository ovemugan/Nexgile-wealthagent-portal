import React, { FormEvent, useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { login } from '../api';

interface LoginScreenProps {
  onAuthenticated: () => Promise<void>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState(import.meta.env.VITE_DEMO_EMAIL || '');
  const [password, setPassword] = useState(import.meta.env.VITE_DEMO_PASSWORD || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      await onAuthenticated();
    } catch {
      localStorage.removeItem('nexgile_access_token');
      setError('Unable to sign in. Check your email and password, then try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf9f4] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#101c2d] text-white flex items-center justify-center font-serif text-2xl font-bold">N</div>
          <h1 className="font-serif text-3xl font-bold mt-4 text-[#1b1c19]">Welcome to Nexgile</h1>
          <p className="text-sm text-[#535f73] mt-2">Sign in to your private wealth workspace</p>
        </div>

        <form onSubmit={submit} className="bg-white border border-[#e4e2dd] rounded-2xl p-6 sm:p-8 shadow-sm">
          <label className="block text-xs font-semibold text-[#44474c] mb-2" htmlFor="email">Email address</label>
          <div className="relative mb-5">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-[#75777d]" />
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-[#c5c6cd] bg-[#fbf9f4] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#101c2d] focus:ring-2 focus:ring-[#d7e3fb]" />
          </div>
          <label className="block text-xs font-semibold text-[#44474c] mb-2" htmlFor="password">Password</label>
          <div className="relative mb-6">
            <LockKeyhole className="absolute left-3 top-3 w-4 h-4 text-[#75777d]" />
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-[#c5c6cd] bg-[#fbf9f4] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#101c2d] focus:ring-2 focus:ring-[#d7e3fb]" />
          </div>
          {error && <p role="alert" className="mb-4 rounded-lg bg-[#ffdad6] px-3 py-2 text-xs font-medium text-[#93000a]">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-[#101c2d] py-3 text-sm font-semibold text-white transition hover:bg-[#1b2a41] disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-[#75777d]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2f5d45]" /> Secure authenticated access
          </div>
        </form>
        <p className="text-center text-[11px] text-[#75777d] mt-5">Demo: advisor@nexgile.demo / DemoPassword123!</p>
      </div>
    </main>
  );
};
