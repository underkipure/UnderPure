import React from 'react';
import { X } from 'lucide-react';

const ForgotPasswordModal = ({
  isOpen,
  onClose,
  forgotStep,
  setForgotStep,
  forgotEmail,
  setForgotEmail,
  forgotOtp,
  setForgotOtp,
  forgotLoading,
  onSendOtp,
  onVerifyOtp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-white p-8 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
        
        <h2 className="text-[24px] font-serif uppercase tracking-widest text-black italic mb-2 text-center">
          {forgotStep === 1 ? 'Reset Password' : 'Enter Code'}
        </h2>
        <p className="text-[12px] font-sans text-gray-500 mb-8 text-center">
          {forgotStep === 1 
            ? 'Enter your registered email and we will send you a verification code.' 
            : `We sent a 6-digit code to ${forgotEmail}. Please enter it below.`}
        </p>

        {forgotStep === 1 ? (
          <form onSubmit={onSendOtp} className="flex flex-col gap-6">
            <div>
              <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">Registered Email</label>
              <input
                type="email"
                required
                placeholder="Your Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border-b border-gray-300 py-3 text-[13px] outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={forgotLoading || !forgotEmail}
              className="w-full bg-black text-white font-bold uppercase tracking-widest py-3.5 text-[12px] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {forgotLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={onVerifyOtp} className="flex flex-col gap-6">
            <div>
              <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black text-center">Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="------"
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full border-b border-gray-300 py-3 text-[24px] tracking-[0.5em] text-center font-bold outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={forgotLoading || forgotOtp.length !== 6}
              className="w-full bg-black text-white font-bold uppercase tracking-widest py-3.5 text-[12px] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {forgotLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => setForgotStep(1)}
              className="text-[11px] font-bold text-gray-500 hover:text-black underline bg-transparent border-none cursor-pointer mt-2"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
