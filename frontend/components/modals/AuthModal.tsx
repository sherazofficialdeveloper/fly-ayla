import React, { useState, useEffect } from 'react';
import { FlyAylaLogo } from '../common/FlyAylaLogo';
import { 
  X, 
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
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register' | 'forgot';
  onSuccessRedirect?: (role: 'customer' | 'admin') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialTab = 'login',
  onSuccessRedirect 
}) => {
  const { login, register, forgotPassword, resetPassword, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialTab);
  
  // Login State (Clean initial state)
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

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

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
        onClose();
        if (onSuccessRedirect && res.role) {
          onSuccessRedirect(res.role as 'customer' | 'admin');
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
      setErrorMessage('Please complete all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMessage('Please provide a valid corporate email address.');
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
        onClose();
        if (onSuccessRedirect) {
          onSuccessRedirect('customer');
        }
      }, 600);
    } else {
      setErrorMessage(res.message || 'Registration failed.');
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
    setSuccessMessage(res.message || 'If an account exists for this email, reset instructions have been sent.');
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const tokenTrimmed = resetToken.trim();
    if (!tokenTrimmed || !newPassword) {
      setErrorMessage('Please enter both the reset token and new password.');
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
      }, 1000);
    } else {
      setErrorMessage(res.message || 'Password reset failed or token expired.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      
      <div 
        className="relative w-full max-w-lg bg-[#0E0E14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <FlyAylaLogo className="h-7 w-auto" />
          </div>

          {activeTab === 'login' && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Welcome back
              </h2>
              <p className="text-sm text-zinc-400">
                Sign in to continue to your Fly Ayla account.
              </p>
            </>
          )}

          {activeTab === 'register' && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Create account
              </h2>
              <p className="text-sm text-zinc-400">
                Sign up for private charter booking and flight management.
              </p>
            </>
          )}

          {activeTab === 'forgot' && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Reset password
              </h2>
              <p className="text-sm text-zinc-400">
                Enter your email address to receive password reset instructions.
              </p>
            </>
          )}

          {activeTab === 'reset' && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Set new password
              </h2>
              <p className="text-sm text-zinc-400">
                Enter your security token and choose a new password.
              </p>
            </>
          )}
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-red-200">Authentication Alert</p>
              <p className="text-red-300 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-emerald-200">Success</p>
              <p className="text-emerald-300 mt-0.5">{successMessage}</p>
            </div>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-13 pl-4 pr-4 bg-zinc-900 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
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
                  className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-13 pl-4 pr-12 bg-zinc-900 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
                <button
                  type="button"
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-semibold text-base rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <div className="text-center pt-3 border-t border-white/10">
              <p className="text-xs text-zinc-400">
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
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alexander"
                  className="w-full h-12 pl-3.5 pr-3.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sterling"
                  className="w-full h-12 pl-3.5 pr-3.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-12 pl-3.5 pr-3.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-12 pl-3.5 pr-3.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Apex Holdings"
                  className="w-full h-12 pl-3.5 pr-3.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full h-12 pl-3.5 pr-10 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
                <button
                  type="button"
                  aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {regPassword && (
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full h-12 pl-3.5 pr-10 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-semibold text-base rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            <div className="text-center pt-2 border-t border-white/10">
              <p className="text-xs text-zinc-400">
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
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">
                Registered Email
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-13 pl-4 pr-4 bg-zinc-900 border border-white/10 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-semibold text-base rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <div className="text-center pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};
