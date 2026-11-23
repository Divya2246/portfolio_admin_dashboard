import { useState, 
  // useRef, 
  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../common/components';
import { ThemeToggle } from '../../common/theme/ThemeToggle';
import { BrandLogo } from '../../common/components/BrandLogo/BrandLogo';
import { ROUTES } from '../../constants';
import {
  signIn,
  signUp,
  resetPassword,
  // createRecaptchaVerifier,
  // sendPhoneVerificationCode,
  // verifyPhoneCode,
  // type ConfirmationResult,
} from '../../firebase/services/auth.service';
import { cn } from '../../utils';

// type EmailView = 'signin' | 'signup' | 'forgot';
// type AuthTab = 'email' | 'phone';

export function LoginPage() {
  const navigate = useNavigate();
  // const [activeTab, setActiveTab] = useState<AuthTab>('email');
  const [emailView, setEmailView] = useState<'signin' | 'signup' | 'forgot'>('signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [phone, setPhone] = useState('');
  // const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  // const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  // const recaptchaVerifierRef = useRef<ReturnType<typeof createRecaptchaVerifier> | null>(null);

  useEffect(() => {
    return () => {
      // recaptchaVerifierRef.current?.clear?.();
      // recaptchaVerifierRef.current = null;
    };
  }, []);

  const clearMessage = () => setMessage(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessage();
    setLoading(true);
    try {
      if (emailView === 'signin') {
        await signIn(email, password);
        navigate(ROUTES.DASHBOARD, { replace: true });
        return;
      }
      if (emailView === 'signup') {
        await signUp(email, password);
        navigate(ROUTES.DASHBOARD, { replace: true });
        return;
      }
      await resetPassword(email);
      setMessage({ type: 'success', text: 'Check your email for the reset link.' });
      setEmailView('signin');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  // const initRecaptcha = () => {
  //   if (!recaptchaContainerRef.current) return null;
  //   recaptchaVerifierRef.current?.clear?.();
  //   const verifier = createRecaptchaVerifier(recaptchaContainerRef.current);
  //   recaptchaVerifierRef.current = verifier;
  //   return verifier;
  // };

  // const handleSendCode = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   clearMessage();
  //   // const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
  //   // if (!normalizedPhone || normalizedPhone.length < 10) {
  //   //   setMessage({ type: 'error', text: 'Enter a valid phone number with country code (e.g. +91...).' });
  //   //   return;
  //   // }
  //   setLoading(true);
  //   try {
  //     const verifier = initRecaptcha();
  //     if (!verifier) {
  //       setMessage({ type: 'error', text: 'Auth not available. Check Firebase config.' });
  //       setLoading(false);
  //       return;
  //     }
  //     const result = await sendPhoneVerificationCode(normalizedPhone, verifier);
  //     if (result) {
  //       // setConfirmationResult(result);
  //       setMessage({ type: 'success', text: 'Verification code sent to your phone.' });
  //     } else {
  //       setMessage({ type: 'error', text: 'Could not send code. Check number and try again.' });
  //     }
  //   } catch (err: unknown) {
  //     const msg = err instanceof Error ? err.message : 'Something went wrong.';
  //     setMessage({ type: 'error', text: msg });
  //     recaptchaVerifierRef.current = null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleVerifyOtp = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!confirmationResult || !otp.trim()) return;
  //   clearMessage();
  //   setLoading(true);
  //   try {
  //     await verifyPhoneCode(confirmationResult, otp.trim());
  //     // setConfirmationResult(null);
  //     setOtp('');
  //     navigate(ROUTES.DASHBOARD, { replace: true });
  //     return;
  //   } catch (err: unknown) {
  //     const msg = err instanceof Error ? err.message : 'Invalid or expired code.';
  //     setMessage({ type: 'error', text: msg });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="site-grid flex min-h-screen items-center justify-center bg-canvas px-4 py-10 text-ink">
      <div className="w-full max-w-md">
        <div className="stage">
          <div className="relative">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h1 className="mb-0">
                <BrandLogo showDomain />
              </h1>
              <ThemeToggle />
            </div>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {emailView !== 'forgot' && (
                  <div>
                    <label htmlFor="login-email" className="mb-1 block text-sm text-ink-secondary">Email</label>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="field"
                    />
                  </div>
                )}
                {emailView === 'forgot' && (
                  <div>
                    <label htmlFor="forgot-email" className="mb-1 block text-sm text-ink-secondary">Email</label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="field"
                    />
                  </div>
                )}
                {emailView !== 'forgot' && (
                  <div>
                    <label htmlFor="login-password" className="mb-1 block text-sm text-ink-secondary">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete={emailView === 'signup' ? 'new-password' : 'current-password'}
                      className="field"
                    />
                  </div>
                )}
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? '…' : emailView === 'signin' ? 'Sign in' : emailView === 'signup' ? 'Sign up' : 'Send reset link'}
                </Button>
                <div className="flex flex-col gap-1 text-center text-sm text-muted">
                  {/* Forgot password & Sign up hidden for now
                  {emailView === 'signin' && (
                    <>
                      <button type="button" onClick={() => setEmailView('forgot')} className="hover:text-slate-700">Forgot password?</button>
                      <button type="button" onClick={() => setEmailView('signup')} className="hover:text-slate-700">Sign up</button>
                    </>
                  )}
                  */}
                  {emailView === 'signup' && (
                    <button type="button" onClick={() => setEmailView('signin')} className="hover:text-slate-700">Sign in</button>
                  )}
                  {emailView === 'forgot' && (
                    <button type="button" onClick={() => setEmailView('signin')} className="hover:text-slate-700">Back</button>
                  )}
                </div>
              </form>
              {message && (
              <div className={cn('mt-4 rounded-2xl px-3 py-2 text-sm', message.type === 'success' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger')}>
                {message.text}
              </div>
            )}
            {/* )} */}

            {/* {activeTab === 'phone' && ( */}
              {/* <div className="space-y-3">
                <div ref={recaptchaContainerRef} id="recaptcha-container" />
                {!confirmationResult ? (
                  <form onSubmit={handleSendCode}>
                    <div className="mb-3">
                      <label htmlFor="login-phone" className="block text-sm text-slate-600 mb-0.5">Phone (with country code)</label>
                      <input
                        id="login-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    </div>
                    <Button type="submit" fullWidth disabled={loading} size="sm">{loading ? '…' : 'Send code'}</Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp}>
                    <div className="mb-3">
                      <label htmlFor="login-otp" className="block text-sm text-slate-600 mb-0.5">Code</label>
                      <input
                        id="login-otp"
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 text-sm text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    </div>
                    <Button type="submit" fullWidth disabled={loading || otp.length < 6} size="sm">{loading ? '…' : 'Verify'}</Button>
                    <button type="button" onClick={() => { setConfirmationResult(null); setOtp(''); clearMessage(); }} className="mt-2 w-full text-sm text-slate-500 hover:text-slate-700">Different number</button>
                  </form>
                )}
              </div> */}
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
