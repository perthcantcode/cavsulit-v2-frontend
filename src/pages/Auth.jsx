import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../utils/helpers';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}

function AuthLayout({ title, sub, children }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-96 auth-aside p-10 flex-shrink-0">
        <div className="auth-aside-brand">
          <div className="auth-aside-brand-icon">
            <ShoppingBag size={18} strokeWidth={2.25} />
          </div>
          <span className="font-display font-bold text-lg">CavSulit</span>
        </div>
        <div>
          <p className="auth-aside-quote">&ldquo;Your hustle deserves to be seen.&rdquo;</p>
          <p className="auth-aside-desc">
            CavSulit is a free campus marketplace for students, instructors, and every member of the CvSU community.
          </p>
        </div>
        <p className="auth-aside-footer">&copy; 2026 CavSulit &middot; ITEC Group 3</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 [background:var(--bg)]">
        <div className="auth-panel">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-none border-[2px] [border-color:#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] [background:var(--green-neon)] flex items-center justify-center"><ShoppingBag size={16} className="[color:var(--text)]"/></div>
            <span className="font-display font-bold [color:var(--text)]">CavSulit</span>
          </div>
          <h1 className="font-bold text-2xl mb-1" style={{ color: "var(--text)" }}>{title}</h1>
          <p className="text-sm [color:var(--text-muted)] mb-8">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { login, loginWithGoogle, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.message || 'Login failed');
      }
      // Show resend option if email not verified
      if (err.code === 'auth/unverified-email') setShowResend(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else {
        setError(err.message || 'Google sign-in failed');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification();
      setResendSuccess(true);
    } catch (err) {
      setError('Could not resend verification email. Please log in first.');
    }
  };

  return (
    <AuthLayout title="Welcome back" sub="Sign in to your CavSulit account">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
          {showResend && (
            <button onClick={handleResend} className="block mt-2 [color:var(--text)] font-semibold underline text-xs">
              Resend verification email
            </button>
          )}
        </div>
      )}
      {resendSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
          ✅ Verification email sent! Check your spam folder.
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="auth-btn-google"
      >
        <GoogleIcon />
        {googleLoading ? 'Signing in...' : 'Continue with Google'}
      </button>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <form onSubmit={submit} className="auth-form">
        <div className="auth-field">
          <label>Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            required
            placeholder="your@email.com"
            className="input"
          />
        </div>
        <div className="auth-field">
          <label>Password</label>
          <div className="auth-field-password">
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type={showPw ? 'text' : 'password'}
              required
              placeholder="••••••••"
              className="input"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary justify-center py-3">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-cav-text-muted">
        Didn't receive verification email?{' '}
        <button onClick={handleResend} className="[color:var(--text)] font-semibold hover:underline">Resend it</button>
      </p>
      <p className="text-sm text-center mt-2 text-cav-text-muted">
        Don't have an account? <Link to="/register" className="[color:var(--text)] font-semibold hover:underline">Sign Up</Link>
      </p>
    </AuthLayout>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', studentId: '', department: 'OTHER', contactNumber: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const isCvsu = form.email.endsWith('@cvsu.edu.ph');
      await register(form);
      if (isCvsu) {
        setVerificationSent(true);
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.message?.includes('Network Error') || err.message?.includes('waking')) {
        setError('Server is waking up, please try again in 30 seconds.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const isCvsu = form.email.endsWith('@cvsu.edu.ph');

  if (verificationSent) {
    return (
      <AuthLayout title="Check your email" sub="One more step to verify your CvSU account">
        <div className="[background:var(--bg-alt)] border-[2px] [border-color:#1a1a1a] [color:var(--text)] text-sm rounded-none px-4 py-4 mb-4 shadow-[5px_5px_0px_#1a1a1a]">
          <p className="font-bold mb-1">📧 Verification email sent!</p>
          <p>We sent a verification link to <strong>{form.email}</strong>. Check your <strong>spam folder</strong> too!</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-xl px-4 py-3 mb-4">
          <p className="font-bold mb-1">⚠️ Important!</p>
          <p>After clicking the verification link, come back and <strong>log in</strong> to activate your CvSU Verified badge.</p>
        </div>
        <button onClick={() => navigate('/login')} className="btn-primary w-full justify-center py-3">
          Go to Login
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create account" sub="Join the CavSulit campus community">
      {isCvsu && form.studentId && (
        <div className="[background:var(--bg-alt)] border-[2px] [border-color:#1a1a1a] [color:var(--text)] text-xs rounded-none px-4 py-3 mb-4 font-semibold shadow-[5px_5px_0px_#1a1a1a]">
          ✅ CvSU email detected — verify your email to get the CvSU Verified badge!
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
      <form onSubmit={submit} className="auth-form">
        <div className="auth-field">
          <label>Full Name *</label>
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
            placeholder="Juan dela Cruz"
            className="input"
          />
        </div>
        <div className="auth-field">
          <label>Email *</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            required
            placeholder="Use @cvsu.edu.ph for verification"
            className="input"
          />
        </div>
        <div className="auth-field">
          <label>Password *</label>
          <div className="auth-field-password">
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type={showPw ? 'text' : 'password'}
              required
              placeholder="Min. 6 characters"
              className="input"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div className="auth-grid-2">
          <div className="auth-field">
            <label>Student ID</label>
            <input
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              placeholder="251XXXXXX"
              className="input"
            />
          </div>
          <div className="auth-field">
            <label>Department</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="input"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="auth-field">
          <label>Contact Number</label>
          <input
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            placeholder="09XX XXX XXXX"
            className="input"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary justify-center py-3">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="text-sm text-center mt-6 text-cav-text-muted">
        Already have an account? <Link to="/login" className="[color:var(--text)] font-semibold hover:underline">Sign In</Link>
      </p>
    </AuthLayout>
  );
}