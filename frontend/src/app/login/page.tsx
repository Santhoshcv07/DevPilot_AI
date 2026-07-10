"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to login');
      }

      const data = await res.json();
      localStorage.setItem('devpilot_token', data.access_token);
      router.push('/chat'); // Assuming /chat is the main app area, or /
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Continue where you left off with your workspace and AI assistant."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] px-4 py-2.5 rounded-lg flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#F7F7F8]">Email address</label>
          <div className="relative flex items-center bg-[#050506] border border-white/[0.08] rounded-xl focus-within:border-white/20 focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-200 group overflow-hidden">
            <div className="absolute left-3.5 text-[#8B93A1] group-focus-within:text-[#F7F7F8] transition-colors pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <input 
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-[#F7F7F8] placeholder-[#8B93A1]/60 text-[14px] py-3 pl-10 pr-4 outline-none autofill:!bg-[#050506] autofill:!text-[#F7F7F8]"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-[#F7F7F8]">Password</label>
            <Link href="/forgot-password" className="text-[13px] text-[#8B93A1] hover:text-[#F7F7F8] font-medium transition-colors relative group">
              Forgot password?
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
          <div className="relative flex items-center bg-[#050506] border border-white/[0.08] rounded-xl focus-within:border-white/20 focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-200 group overflow-hidden">
            <div className="absolute left-3.5 text-[#8B93A1] group-focus-within:text-[#F7F7F8] transition-colors pointer-events-none">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-[#F7F7F8] placeholder-[#8B93A1]/60 text-[14px] py-3 pl-10 pr-10 outline-none autofill:!bg-[#050506] autofill:!text-[#F7F7F8]"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-[#8B93A1] hover:text-[#F7F7F8] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          disabled={isLoading || !email || !password}
          className="group relative w-full flex items-center justify-center gap-2 bg-[#F7F7F8] hover:bg-white text-[#050506] font-semibold py-3 rounded-xl transition-all duration-200 mt-6 shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:-translate-y-[1px] active:translate-y-[0px] disabled:opacity-70 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#050506]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            <>
              Log in
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-[3px]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </>
          )}
        </button>
      </form>
      
      <div className="text-center mt-6 text-[13.5px] text-[#8B93A1]">
        Don't have an account?{' '}
        <Link href="/signup" className="text-[#F7F7F8] hover:text-white font-medium transition-colors relative group">
          Sign up
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-300 group-hover:w-full" />
        </Link>
      </div>
    </AuthLayout>
  );
}
