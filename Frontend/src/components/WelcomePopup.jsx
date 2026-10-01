import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useSiteSettingsStore } from '../store/siteSettingsStore';
import { useAuthStore } from '../store/authStore';

export default function WelcomePopup() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const popupSettings = useSiteSettingsStore((s) => s.popupSettings);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Only show if enabled, not authenticated, and hasn't been shown before
    const hasShown = localStorage.getItem('welcome_popup_shown');
    if (!hasShown && popupSettings?.enabled && !isAuthenticated) {
      // Add a slight delay before showing
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [popupSettings?.enabled, isAuthenticated]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('welcome_popup_shown', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose(); // Close after submitting
    if (email) {
      navigate('/signup', { state: { email } });
    }
  };

  if (!isOpen || !popupSettings?.enabled || isAuthenticated) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Welcome Promotion"
        className="relative w-full max-w-[800px] flex flex-col md:flex-row shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500"
        style={{ backgroundColor: popupSettings.bgColor || '#ffffff', color: popupSettings.textColor || '#000000' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          aria-label="Close welcome offer"
          className="absolute top-4 right-4 z-10 transition-colors bg-white/50 rounded-full p-1 md:bg-transparent md:p-0 hover:opacity-70"
          style={{ color: popupSettings.textColor || '#000000' }}
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        {/* Image Side */}
        {popupSettings.image && (
          <div className="w-full md:w-1/2 h-48 md:h-auto bg-gray-100 relative">
            <img 
              src={popupSettings.image} 
              alt="Welcome promotion preview" 
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}

        {/* Content Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center items-center">
          <h2 className="font-serif text-5xl md:text-6xl mb-2 tracking-tight">
            {popupSettings.discountText || "15% OFF"}
          </h2>
          <h3 className="text-xs md:text-sm uppercase tracking-[0.2em] mb-6 font-semibold opacity-90">
            {popupSettings.heading || "YOUR FIRST ORDER"}
          </h3>
          <p className="mb-8 max-w-sm text-sm leading-relaxed opacity-80">
            {popupSettings.text || "Get VIP access to our newest launches, limited-edition sets, sales, and more."}
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Email address"
              aria-label="Email address for discount code"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-4 text-sm focus:outline-none transition-colors text-center bg-transparent"
              style={{ borderColor: popupSettings.textColor ? `${popupSettings.textColor}40` : 'rgba(0,0,0,0.2)', color: popupSettings.textColor || '#000000' }}
            />
            <button 
              type="submit"
              className="w-full p-4 text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:opacity-90"
              style={{ backgroundColor: popupSettings.buttonColor || '#000000', color: popupSettings.buttonTextColor || '#ffffff' }}
            >
              {popupSettings.buttonText || "SIGN UP"}
            </button>
          </form>

          <button 
            onClick={handleClose}
            className="mt-6 text-xs underline uppercase tracking-widest transition-colors hover:opacity-70 opacity-60"
          >
            No, Thanks
          </button>
          
          <p className="mt-8 text-[10px] max-w-[250px] mx-auto leading-relaxed opacity-50">
            By signing up you agree to our Terms & Conditions and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
