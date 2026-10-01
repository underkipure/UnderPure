import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import { useSiteSettingsStore, DEFAULTS } from '../../store/siteSettingsStore';

import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import AuthSlidingOverlay from './components/AuthSlidingOverlay';
import ForgotPasswordModal from './components/ForgotPasswordModal';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, googleLogin, forgotPassword, verifyOtpAndLogin, isAuthenticated } = useAuthStore();
  const authData = useSiteSettingsStore((s) => s.authData);
  const d = authData || DEFAULTS.authData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/account', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');

  useEffect(() => {
    setIsLogin(location.pathname !== '/signup');
  }, [location.pathname]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState(location.state?.email || '');
  const [signupDob, setSignupDob] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res?.birthdayReward) {
        toast.success(`Happy Birthday Month! 🎂 You received ${res.birthdayBonus} UP Points!`, { duration: 5000 });
      } else {
        toast.success('Welcome back!');
      }
      navigate('/account');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setSignupLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register(fullName || signupEmail, signupEmail, signupPassword, signupDob);
      toast.success('Account created! Welcome!');
      navigate('/account');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail);
      toast.success('OTP sent to your email.');
      setForgotStep(2);
    } catch(err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await verifyOtpAndLogin(forgotEmail, forgotOtp);
      toast.success('Logged in successfully! Please update your password from account settings.');
      setShowForgotModal(false);
      navigate('/account');
    } catch(err) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success(isLogin ? 'Logged in with Google!' : 'Account created! Welcome!');
      navigate('/account');
    } catch (err) {
      toast.error(err.message || (isLogin ? 'Google login failed' : 'Google signup failed'));
    }
  };

  const handleGoogleError = () => {
    toast.error(isLogin ? 'Google Login Failed' : 'Google Signup Failed');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5] px-0 md:px-4 py-0 md:py-10">
      <div className="relative w-full max-w-[960px] min-h-[640px] bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row rounded-none">

        {/* LOGIN FORM */}
        <LoginForm
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          authData={d}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loginLoading={loginLoading}
          onLogin={handleLogin}
          onOpenForgotModal={() => {
            setShowForgotModal(true);
            setForgotStep(1);
            setForgotEmail(loginEmail);
            setForgotOtp('');
          }}
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
        />

        {/* SIGNUP FORM */}
        <SignupForm
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          authData={d}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          signupEmail={signupEmail}
          setSignupEmail={setSignupEmail}
          signupDob={signupDob}
          setSignupDob={setSignupDob}
          signupPassword={signupPassword}
          setSignupPassword={setSignupPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          signupLoading={signupLoading}
          onSignup={handleSignup}
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
        />

        {/* SLIDING IMAGE OVERLAY */}
        <AuthSlidingOverlay
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          authData={d}
        />

        {/* FORGOT PASSWORD MODAL */}
        <ForgotPasswordModal
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
          forgotStep={forgotStep}
          setForgotStep={setForgotStep}
          forgotEmail={forgotEmail}
          setForgotEmail={setForgotEmail}
          forgotOtp={forgotOtp}
          setForgotOtp={setForgotOtp}
          forgotLoading={forgotLoading}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
        />

      </div>
    </div>
  );
};

export default AuthPage;
