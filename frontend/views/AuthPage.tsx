import React, { useState } from 'react';
import { FlyAylaLogo } from '../components/common/FlyAylaLogo';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Lock,
  Mail,
  ShieldCheck,
  Plane
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot' | 'reset';
  onNavigate: (page: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  initialMode = 'login',
  onNavigate 
}) => {
  const { login, register, forgotPassword, resetPassword, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  
  // Login State (Clean initial state - no hardcoded credentials)
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

  // Register State
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Forgot / Reset Password State
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  // Feedback Messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const calculatePasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: '', color: 'bg-zinc-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(activeTab === 'register' ? regPassword : newPassword);

  const handleBack = () => {
    if (activeTab === 'forgot' || activeTab === 'reset') {
      setActiveTab('login');
      setErrorMessage(null);
      setSuccessMessage(null);
    } else {
      onNavigate('home');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailTrimmed = loginEmail.trim();
    if (!emailTrimmed || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = await login({ email: emailTrimmed, password: loginPassword });
    if (res.success) {
      setSuccessMessage('Authentication successful. Redirecting...');
      setTimeout(() => {
        if (res.role === 'admin') {
          onNavigate('admin');
        } else {
          onNavigate('customer');
        }
      }, 400);
    } else {
      setErrorMessage(res.message || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const fnTrimmed = firstName.trim();
    const lnTrimmed = lastName.trim();
    const emailTrimmed = regEmail.trim();

    if (!fnTrimmed || !lnTrimmed || !emailTrimmed || !regPassword || !confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const res = await register({
      firstName: fnTrimmed,
      lastName: lnTrimmed,
      email: emailTrimmed,
      phone: phone.trim() || '+1 (555) 000-0000',
      companyName: companyName.trim() || '',
      password: regPassword,
    });

    if (res.success) {
      setSuccessMessage('Your Fly Ayla account has been created successfully.');
      setTimeout(() => {
        onNavigate('customer');
      }, 600);
    } else {
      setErrorMessage(res.message || 'Registration failed. Please try again.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailTrimmed = forgotEmail.trim();
    if (!emailTrimmed) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    const res = await forgotPassword(emailTrimmed);
    setSuccessMessage(res.message || 'If an account exists for this email, password reset instructions have been sent.');
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const tokenTrimmed = resetToken.trim();
    if (!tokenTrimmed || !newPassword) {
      setErrorMessage('Please enter both the reset token and your new password.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const res = await resetPassword(tokenTrimmed, newPassword);
    if (res.success) {
      setSuccessMessage('Password has been updated. Please sign in with your new credentials.');
      setTimeout(() => {
        setActiveTab('login');
      }, 1200);
    } else {
      setErrorMessage(res.message || 'Password reset failed or token expired.');
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-red-600 selection:text-white">
      
      {/* LEFT COLUMN: Premium Aviation Image & Editorial Showcase (Hidden on small mobile or stacked) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 flex-col justify-between p-12 border-r border-white/10">
        
        {/* Luxury Jet Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=85')`,
          }}
        >
          {/* Multi-layered cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08080A]/80 via-transparent to-[#08080A]/40" />
          <div className="absolute inset-0 bg-black/40 backdrop-brightness-90" />
        </div>

        {/* Top Branding in Visual Column */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <FlyAylaLogo className="h-9 w-auto" />
            <div className="h-5 w-px bg-white/20" />
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium">
              Private Aviation
            </span>
          </div>
        </div>

        {/* Bottom Editorial Showcase */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wide backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PAYLA FORENSIC™ COMPLIANCE VERIFIED</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-light tracking-tight text-white leading-tight font-serif">
              Uncompromising Precision & Bespoke Global Freedom
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed font-light">
              Experience flawless charter execution, transparent algorithmic flight pricing, and real-time AML forensic clearance across 4,200+ global executive airports.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-red-500" />
              <span>Heavy Jets & Ultra Long Range Fleet</span>
            </div>
            <span className="font-mono text-zinc-300">24/7 Operations Desk</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-16 relative bg-[#08080A]">
        
        {/* Back Button */}
        <div className="w-full max-w-[480px] mb-8">
          <button
            id="btn-auth-back"
            onClick={handleBack}
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
        </div>

        {/* Form Container (Strict 400px - 480px max-width) */}
        <div className="w-full max-w-[480px] space-y-8">
          
          {/* Logo & Header */}
          <div className="space-y-2">
            <div className="flex lg:hidden items-center gap-2.5 mb-6">
              <FlyAylaLogo className="h-8 w-auto" />
            </div>

            {activeTab === 'login' && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Welcome back
                </h1>
                <p className="text-base text-zinc-400">
                  Sign in to continue to your Fly Ayla account.
                </p>
              </>
            )}

            {activeTab === 'register' && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Create account
                </h1>
                <p className="text-base text-zinc-400">
                  Sign up for private charter booking and VIP flight management.
                </p>
              </>
            )}

            {activeTab === 'forgot' && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Reset password
                </h1>
                <p className="text-base text-zinc-400">
                  Enter your email address to receive password reset instructions.
                </p>
              </>
            )}

            {activeTab === 'reset' && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Set new password
                </h1>
                <p className="text-base text-zinc-400">
                  Enter your security token and choose a new password.
                </p>
              </>
            )}
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div 
              id="auth-error-banner"
              className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm flex items-start gap-3 animate-fadeIn"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-200">Authentication Alert</p>
                <p className="text-red-300 text-xs mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div 
              id="auth-success-banner"
              className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3 animate-fadeIn"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-emerald-200">Request Confirmed</p>
                <p className="text-emerald-300 text-xs mt-0.5">{successMessage}</p>
              </div>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              
              {/* Email Field (Comfortable 54px height) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-14 pl-4 pr-4 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="input-login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-14 pl-4 pr-12 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                  />
                  <button
                    type="button"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button (54px height) */}
              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-semibold text-base rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Bottom Switch to Register */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-sm text-zinc-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Create account
                  </button>
                </p>
              </div>

            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* First Name & Last Name (Two columns on desktop, stacked on mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-300">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-reg-firstname"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alexander"
                    className="w-full h-13 pl-4 pr-4 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-300">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-reg-lastname"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sterling"
                    className="w-full h-13 pl-4 pr-4 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">
                  Corporate / VIP Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-reg-email"
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="alexander@apex-capital.com"
                  className="w-full h-13 pl-4 pr-4 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
              </div>

              {/* Optional Phone & Company Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-300">
                    Phone (Optional)
                  </label>
                  <input
                    id="input-reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    className="w-full h-13 pl-4 pr-4 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-300">
                    Company (Optional)
                  </label>
                  <input
                    id="input-reg-company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Apex Holdings"
                    className="w-full h-13 pl-4 pr-4 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full h-13 pl-4 pr-12 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                  />
                  <button
                    type="button"
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {regPassword && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full h-13 pl-4 pr-12 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-register-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-semibold text-base rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              {/* Bottom Switch to Login */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-sm text-zinc-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>

            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Registered Email
                </label>
                <input
                  id="input-forgot-email"
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-14 pl-4 pr-4 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
              </div>

              <button
                id="btn-forgot-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-semibold text-base rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="flex items-center justify-between text-sm text-zinc-400 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  ← Back to Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reset');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Have a reset token?
                </button>
              </div>

            </form>
          )}

          {/* TAB 4: RESET PASSWORD */}
          {activeTab === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">
                  Security Reset Token
                </label>
                <input
                  id="input-reset-token"
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Paste token received via email"
                  className="w-full h-13 pl-4 pr-4 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="input-reset-new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full h-13 pl-4 pr-12 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                  />
                  <button
                    type="button"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">
                  Confirm New Password
                </label>
                <input
                  id="input-reset-confirm-password"
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full h-13 pl-4 pr-4 bg-zinc-900/90 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
              </div>

              <button
                id="btn-reset-password-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-semibold text-base rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>

              <div className="text-center pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
