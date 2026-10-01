import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AuthSocialButtons from './AuthSocialButtons';

const SignupForm = ({
  isLogin,
  setIsLogin,
  authData,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  signupEmail,
  setSignupEmail,
  signupDob,
  setSignupDob,
  signupPassword,
  setSignupPassword,
  confirmPassword,
  setConfirmPassword,
  signupLoading,
  onSignup,
  onGoogleSuccess,
  onGoogleError,
}) => {
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const d = authData;

  return (
    <div 
      className={`absolute inset-y-0 right-0 w-full md:w-1/2 flex items-center justify-center p-8 md:p-14 overflow-y-auto transition-all duration-700 ease-in-out ${
        !isLogin ? 'z-20 opacity-100 pointer-events-auto translate-x-0' : 'z-10 opacity-0 pointer-events-none translate-x-10'
      }`}
    >
      <div className="w-full max-w-[360px] flex flex-col items-center">
        <h1 className="text-[30px] font-serif uppercase tracking-widest text-black italic mb-2">
          {d.signupHeading || 'Create Account'}
        </h1>
        <p className="text-[12px] font-sans text-gray-500 mb-8 text-center">
          {d.signupSubheading || 'Join us. Create your account below.'}
        </p>

        <form onSubmit={onSignup} className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">First Name</label>
              <input 
                type="text" 
                placeholder="First Name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                className="w-full border-b border-gray-300 py-2.5 text-[13px] outline-none focus:border-black transition-colors bg-transparent" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">Last Name</label>
              <input 
                type="text" 
                placeholder="Last Name" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                className="w-full border-b border-gray-300 py-2.5 text-[13px] outline-none focus:border-black transition-colors bg-transparent" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">Email</label>
              <input 
                type="email" 
                required 
                placeholder="Your Email" 
                value={signupEmail} 
                onChange={(e) => setSignupEmail(e.target.value)} 
                className="w-full border-b border-gray-300 py-2.5 text-[13px] outline-none focus:border-black transition-colors bg-transparent" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">Date of Birth (Optional)</label>
              <input 
                type="date" 
                value={signupDob} 
                onChange={(e) => setSignupDob(e.target.value)} 
                className="w-full border-b border-gray-300 py-2.5 text-[13px] outline-none focus:border-black transition-colors bg-transparent text-gray-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">Password</label>
              <div className="relative">
                <input 
                  type={showSignupPassword ? "text" : "password"} 
                  required
                  placeholder="Password" 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full border-b border-gray-300 py-2.5 pr-8 text-[13px] outline-none focus:border-black transition-colors bg-transparent" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowSignupPassword(!showSignupPassword)} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  {showSignupPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">Confirm</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  placeholder="Confirm" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b border-gray-300 py-2.5 pr-8 text-[13px] outline-none focus:border-black transition-colors bg-transparent" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                </button>
              </div>
            </div>
          </div>

          {d.requireNewsletterOptIn && (
            <label className="flex items-start gap-3 mt-1 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-3.5 h-3.5 mt-0.5 accent-black border-gray-300" 
              />
              <span className="text-[11px] text-gray-500 group-hover:text-black transition-colors leading-tight">
                Yes, sign me up to receive the latest updates and offers.
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={signupLoading}
            className="w-full bg-black text-white font-bold uppercase tracking-widest py-3.5 text-[12px] hover:bg-gray-800 transition-colors mt-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {signupLoading ? 'Creating Account...' : (d.signupButtonText || 'Sign Up')}
          </button>
        </form>

        <AuthSocialButtons
          socialLogins={d.socialLogins || []}
          isLogin={isLogin}
          onGoogleSuccess={onGoogleSuccess}
          onGoogleError={onGoogleError}
        />

        <div className="mt-5 text-[12px] font-sans text-gray-500">
          Already have an account?{' '}
          <button 
            onClick={() => setIsLogin(true)} 
            className="font-bold text-black underline bg-transparent border-none cursor-pointer text-[12px]"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
