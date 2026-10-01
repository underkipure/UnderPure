import React from 'react';
import { Link } from 'react-router-dom';

const AuthSlidingOverlay = ({ isLogin, setIsLogin, authData }) => {
  const d = authData;

  return (
    <div
      className={`hidden md:flex absolute inset-y-0 w-1/2 z-20 transition-all duration-700 ease-in-out ${isLogin ? 'left-1/2' : 'left-0'}`}
    >
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#222] to-[#111]">
        {d.sideImage && (
          <img 
            loading="lazy" 
            src={d.sideImage} 
            alt="Fashion" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-10 text-center">
          <Link to="/" className="no-underline">
            <h2 className="text-[28px] font-serif uppercase tracking-widest text-white mb-4">UNDERPURE</h2>
          </Link>
          <p className="text-[13px] font-sans text-white text-opacity-80 mb-8 max-w-[280px] leading-relaxed">
            {isLogin 
              ? 'New here? Create an account to unlock exclusive offers & early access.' 
              : 'Welcome back! Sign in to access your orders, wishlist & loyalty rewards.'}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="border border-white text-white font-bold uppercase tracking-widest py-3 px-10 text-[11px] hover:bg-white hover:text-black transition-colors bg-transparent cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthSlidingOverlay;
