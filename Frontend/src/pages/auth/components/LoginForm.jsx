import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AuthSocialButtons from './AuthSocialButtons';

const LoginForm = ({
  isLogin,
  setIsLogin,
  authData,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginLoading,
  onLogin,
  onOpenForgotModal,
  onGoogleSuccess,
  onGoogleError,
}) => {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const d = authData;

  return (
    <div 
      className={`absolute inset-y-0 left-0 w-full md:w-1/2 flex items-center justify-center p-8 md:p-14 transition-all duration-700 ease-in-out ${
        isLogin ? 'z-20 opacity-100 pointer-events-auto translate-x-0' : 'z-10 opacity-0 pointer-events-none -translate-x-10'
      }`}
    >
      <div className="w-full max-w-[360px] flex flex-col items-center">
        <h1 className="text-[30px] font-serif uppercase tracking-widest text-black italic mb-2">
          {d.loginHeading || 'Login'}
        </h1>
        <p className="text-[12px] font-sans text-gray-500 mb-8 text-center">
          {d.loginSubheading || 'Welcome back. Sign in to your account.'}
        </p>

        <form onSubmit={onLogin} className="w-full flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">Email</label>
            <input
              type="email"
              required
              placeholder="Your Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full border-b border-gray-300 py-3 text-[13px] outline-none focus:border-black transition-colors bg-transparent"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">Password</label>
            <div className="relative">
              <input 
                type={showLoginPassword ? "text" : "password"} 
                required
                placeholder="Password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-3 pr-8 text-[13px] outline-none focus:border-black transition-colors bg-transparent" 
              />
              <button 
                type="button" 
                onClick={() => setShowLoginPassword(!showLoginPassword)} 
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                {showLoginPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
          {d.showForgotPassword !== false && (
            <div className="flex justify-end mt-1">
              <button 
                type="button" 
                onClick={onOpenForgotModal} 
                className="text-[11px] font-bold text-gray-500 hover:text-black underline bg-transparent border-none cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-black text-white font-bold uppercase tracking-widest py-3.5 text-[12px] hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loginLoading ? 'Signing in...' : (d.loginButtonText || 'Sign In')}
          </button>
        </form>

        <AuthSocialButtons
          socialLogins={d.socialLogins || []}
          isLogin={isLogin}
          onGoogleSuccess={onGoogleSuccess}
          onGoogleError={onGoogleError}
        />

        <div className="mt-6 text-[12px] font-sans text-gray-500">
          Don't have an account?{' '}
          <button 
            onClick={() => setIsLogin(false)} 
            className="font-bold text-black underline bg-transparent border-none cursor-pointer text-[12px]"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
