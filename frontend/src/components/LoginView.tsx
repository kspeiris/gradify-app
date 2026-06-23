import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound, 
  Chrome, 
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  Target,
  BarChart3
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Interaction/Validation state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [activeFormType, setActiveFormType] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Forgot password flow helper
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Custom visual toast for help alerts (e.g. Contact Support)
  const [supportToast, setSupportToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setSupportToast(msg);
    setTimeout(() => setSupportToast(null), 3500);
  };

  // Validate inputs
  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email) {
      setEmailError('Email address is required to proceed.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please present a valid academic email syntax (e.g. name@university.edu).');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please input your password secret code.');
      isValid = false;
    } else if (password.length < 5) {
      setPasswordError('Password code must be at least 5 alphanumeric characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setGeneralError('');

    // Simulate standard authentications validation
    setTimeout(() => {
      // Allow any login with standard length, but demo password check if users type "wrong"
      if (password === '12345') {
        setPasswordError('Incorrect password signature detected. Please try another key.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setLoginSuccess(true);

      // Save token state
      setTimeout(() => {
        localStorage.setItem('ssp_is_logged_in', 'true');
        onLoginSuccess();
      }, 1000);
    }, 1500);
  };

  const handleThirdPartySignIn = (provider: 'google' | 'microsoft') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);
      setTimeout(() => {
        localStorage.setItem('ssp_is_logged_in', 'true');
        onLoginSuccess();
      }, 900);
    }, 1200);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setGeneralError('Please enter a valid email to receive reset instructions.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setForgotSubmitted(true);
      setGeneralError('');
    }, 1000);
  };

  const handleMockRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setGeneralError('All core registration credential items are required.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);
      setTimeout(() => {
        localStorage.setItem('ssp_is_logged_in', 'true');
        onLoginSuccess();
      }, 1000);
    }, 1500);
  };

  return (
    <div id="saas-auth-viewport" className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden animate-fade-in select-none w-full">
      
      {/* ----------------- LEFT SIDE (40% width): BRANDING & COMPREHENSIVE CHARTS PREVIEW ----------------- */}
      <div id="auth-branding-panel" className="w-full lg:w-[42%] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-slate-100 p-8 lg:p-12 xl:p-16 flex flex-col justify-between relative overflow-hidden border-r border-slate-800 flex-shrink-0">
        
        {/* Subtle mesh/grid pattern overlay backgrounds */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-25 pointer-events-none" />

        {/* Top Logo and University branding sequence */}
        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-300 font-mono tracking-widest block uppercase">DEAN PORTAL ENG</span>
              <h1 className="text-sm font-black text-white tracking-wider uppercase">Student Success Platform</h1>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Track, Analyze, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Improve</span> Your Academic Success
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Manage semesters, subjects, assignments, exams, GPA, and academic goals from a single beautifully-integrated SaaS platform.
            </p>
          </div>
        </div>

        {/* Dynamic visual dashboard widgets simulations (gpa chart, timeline, analytics indicators) */}
        <div className="relative z-10 my-8 lg:my-0 space-y-4 max-w-sm xl:max-w-md bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">LIVE ANALYTICS DOSSIER</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 font-black">CGPA: 3.72</span>
          </div>

          {/* Simulated Mini-Bar Chart (GPA progress metrics) */}
          <div className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="font-semibold">Semester 5 Current Standing</span>
                <span className="font-extrabold text-emerald-400">First Class Honors</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            {/* Micro historical trajectory graph representation */}
            <div className="pt-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">CGPA Trajectory Timeline</span>
              <div className="flex items-end justify-between h-16 pt-2 pb-1 px-1 bg-slate-950/40 rounded-xl border border-slate-850">
                <div className="w-8 flex flex-col items-center gap-1">
                  <div className="w-3 bg-indigo-500/30 rounded-t h-8 group-hover:bg-indigo-400 transition-all" />
                  <span className="text-[8px] font-mono text-slate-550">Sem 1</span>
                </div>
                <div className="w-8 flex flex-col items-center gap-1">
                  <div className="w-3 bg-indigo-500/50 rounded-t h-10" />
                  <span className="text-[8px] font-mono text-slate-550">Sem 2</span>
                </div>
                <div className="w-8 flex flex-col items-center gap-1">
                  <div className="w-3 bg-indigo-500/70 rounded-t h-11" />
                  <span className="text-[8px] font-mono text-slate-500">Sem 3</span>
                </div>
                <div className="w-8 flex flex-col items-center gap-1">
                  <div className="w-3 bg-indigo-500/80 rounded-t h-13" />
                  <span className="text-[8px] font-mono text-slate-500">Sem 4</span>
                </div>
                <div className="w-8 flex flex-col items-center gap-1">
                  <div className="w-3 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t h-14" />
                  <span className="text-[8px] font-mono text-indigo-400 font-extrabold">Sem 5</span>
                </div>
              </div>
            </div>

            {/* Quick interactive features status layout */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Automatic GPA Audits</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Syllabus Calibrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info links inside the branding portion */}
        <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-6 mt-6 lg:mt-0 font-sans">
          <span>&copy; {new Date().getFullYear()} Student Success Platform</span>
          <div className="flex gap-4">
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-indigo-300 transition-colors">Terms of Service</a>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-indigo-300 transition-colors">Privacy Policy</a>
            <a href="#support" onClick={(e) => { e.preventDefault(); triggerToast("University Service Line: support@success.edu"); }} className="hover:text-indigo-300 transition-colors">Contact Support</a>
          </div>
        </div>

      </div>

      {/* ----------------- RIGHT SIDE (58% width): LOGIN INTAKE INTERFACE ----------------- */}
      <div id="auth-main-panel" className="w-full lg:w-[58%] lg:flex-shrink-0 bg-white p-8 lg:p-12 xl:p-20 flex flex-col items-center justify-center relative min-w-0">
        
        {/* Decorative corner blur elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* SECURE SYSTEM STATUS BADGE */}
          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-2xl w-full">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-slate-700" />
              <div className="text-left">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Security Protocol</span>
                <span className="text-[11px] font-extrabold text-slate-700">AES-256 JWT Authentication Enabled</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-850 text-[9px] font-mono font-black uppercase py-0.5 px-2 rounded-full border border-emerald-100">
              Secure Link
            </span>
          </div>

          {/* CONDITIONAL SUB-FORM RENDERING based on activeFormType router */}
          {activeFormType === 'signin' && (
            <div className="space-y-6">
              
              {/* Header Title labels */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Welcome Back 👋
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Sign in to continue your academic journey. Use any credential combination to experience the active mock state.
                </p>
              </div>

              {/* SUCCESS LOADING ANIMATIONS OVERLAY */}
              {loginSuccess ? (
                <div className="bg-emerald-50 border border-emerald-150 p-6 rounded-3xl text-center space-y-4 animate-scale-up">
                  <div className="h-12 w-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-emerald-950 text-sm">Authentication Credentials Verified!</h5>
                    <p className="text-xs text-slate-600">Simulating authorization tokens. Redirecting to your academic dashboard...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  
                  {/* Email block label */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-505 flex items-center justify-between">
                      <span>Email Address</span>
                      <span className="text-slate-400 lowercase font-medium">student@example.com</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        placeholder="student@example.com"
                        className={`w-full bg-slate-55 border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none transition-all text-slate-800 ${
                          emailError 
                            ? 'border-red-400 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200' 
                            : 'border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-[10px] text-red-650 bg-red-50 p-2 rounded-lg border border-red-100 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" /> {emailError}
                      </p>
                    )}
                  </div>

                  {/* Password block label */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-black uppercase tracking-wider text-slate-500">Password</span>
                      <button 
                        type="button" 
                        onClick={() => setActiveFormType('forgot')}
                        className="text-indigo-600 hover:text-indigo-800 font-extrabold transition-colors"
                      >
                        Forgot Password Link?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError('');
                        }}
                        placeholder="Enter your password"
                        className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold outline-none transition-all text-slate-800 ${
                          passwordError 
                            ? 'border-red-400 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-200' 
                            : 'border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-[10px] text-red-650 bg-red-50 p-2 rounded-lg border border-red-100 font-medium flex items-center gap-1 animate-shake">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" /> {passwordError}
                      </p>
                    )}
                  </div>

                  {/* REMEMBER ME CHECKBOX */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-slate-500 font-medium">Keep me signed in for 30 school days</span>
                    </label>
                  </div>

                  {/* SUBMIT INDO BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Verifying Ledger Sync...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                </form>
              )}

              {/* DIVIDER OR */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              {/* SECONDARY AUTHENTICATIONS LIST */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleThirdPartySignIn('google')}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Chrome className="w-4 h-4 text-indigo-500" />
                  <span>Google SSO</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleThirdPartySignIn('microsoft')}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-purple-500" />
                  <span>Microsoft 365</span>
                </button>
              </div>

              {/* ADDITIONAL LINK SECTOR */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 font-medium">
                  Don't have an university account?{' '}
                  <button
                    onClick={() => setActiveFormType('signup')}
                    type="button"
                    className="text-indigo-600 hover:text-indigo-800 font-extrabold"
                  >
                    Create Account
                  </button>
                </p>
              </div>

            </div>
          )}

          {activeFormType === 'signup' && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Create Academic Account</h3>
                <p className="text-xs text-slate-500">Establish a sandbox student ledger account to track metrics.</p>
              </div>

              <form onSubmit={handleMockRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter school register name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">University Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@university.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Secure Password code</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters recommended"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl"
                >
                  Register Student Account
                </button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveFormType('signin')}
                  className="text-xs text-indigo-600 font-black"
                >
                  &larr; Back to sign in portal
                </button>
              </div>
            </div>
          )}

          {activeFormType === 'forgot' && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Retrieve Secret Code</h3>
                <p className="text-xs text-slate-500">Provide your school credential email to send password recovery links.</p>
              </div>

              {forgotSubmitted ? (
                <div className="bg-indigo-50 border border-indigo-150 p-5 rounded-2xl space-y-3 text-center">
                  <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h5 className="font-extrabold text-indigo-950 text-xs text-center">Recovery Code Filed</h5>
                  <p className="text-xs text-slate-550">We have transmitted a recovery token link to your university email.</p>
                  <button
                    onClick={() => {
                      setForgotSubmitted(false);
                      setActiveFormType('signin');
                    }}
                    className="text-xs font-extrabold text-indigo-600 hover:underline pt-2 inline-block"
                  >
                    Return to sign in screen &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-450 uppercase block">Registered Academic Email</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl"
                  >
                    Transmission Restoration Link
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFormType('signin')}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
                >
                  Cancel and restore sign in
                </button>
              </div>
            </div>
          )}

          {/* OPTIONAL INFORMATION CARD (Academic Features Preview Showcase list) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs w-full">
            <h4 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Academic Features Preview Showcase
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-650 font-sans font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>GPA Tracking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>Assignment Management</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>Exam Tracking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>Semester Analytics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>Academic Goals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>Performance Insights</span>
              </div>
            </div>
          </div>

          {/* PRIVACY NOTICE DATA LAWS BADGES */}
          <div className="text-center font-sans space-y-1 pt-2">
            <span className="text-[10px] text-slate-400 font-medium block">
              We protect your metadata profile under FERPA requirements.
            </span>
            <span className="text-[9px] font-mono text-slate-350 block">
              Student Success Platform • Verified Sandbox Database node
            </span>
          </div>

        </div>

      </div>

      {supportToast && (
        <div id="login-support-toast" className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white font-semibold text-xs px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{supportToast}</span>
        </div>
      )}

    </div>
  );
};
