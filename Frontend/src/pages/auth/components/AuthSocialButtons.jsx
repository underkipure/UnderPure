import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const AuthSocialButtons = ({
  socialLogins = [],
  isLogin,
  onGoogleSuccess,
  onGoogleError,
}) => {
  if (!socialLogins || socialLogins.length === 0) return null;

  return (
    <>
      <div className="w-full flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-[10px] font-bold font-sans uppercase tracking-widest text-gray-400">Or</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {socialLogins.includes('Google') && (
          <div className="w-full flex justify-center mb-3">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              useOneTap={isLogin}
              shape="square"
              theme="outline"
              text={isLogin ? "continue_with" : "signup_with"}
              size="large"
              width="360"
              logo_alignment="center"
            />
          </div>
        )}
        {socialLogins.includes('Facebook') && (
          <button 
            type="button" 
            className="w-full border border-gray-300 text-gray-600 font-bold uppercase tracking-widest py-3 text-[11px] hover:border-black hover:text-black transition-colors flex justify-center items-center gap-3 cursor-pointer"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
            Continue with Facebook
          </button>
        )}
        {socialLogins.includes('Apple') && (
          <button 
            type="button" 
            className="w-full border border-gray-300 text-gray-600 font-bold uppercase tracking-widest py-3 text-[11px] hover:border-black hover:text-black transition-colors flex justify-center items-center gap-3 cursor-pointer"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.365 21.43c-1.464.918-2.645 1.01-4.004.018-3.08-2.222-7.531-9.52-5.918-14.73 1.03-3.328 3.864-4.664 6.136-4.664 2.22 0 3.324.966 5.093.966 1.71 0 2.573-.918 5.14-.918 1.722 0 4.148 1.082 5.378 3.528-4.814 2.378-3.642 9.07 1.156 10.978-1.077 2.73-2.693 5.432-4.816 8.358-1.564 2.16-2.887 3.56-4.575 3.56-1.528 0-2.482-.87-4.59-1.096zm-4.46-21.43c-.417 2.45 1.258 4.673 3.682 5.09.417-2.45-1.258-4.673-3.682-5.09z"/></svg>
            Continue with Apple
          </button>
        )}
      </div>
    </>
  );
};

export default AuthSocialButtons;
