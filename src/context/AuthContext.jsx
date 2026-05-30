import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';
import api from '../utils/api';

const AuthContext = createContext(null);

function isLocalApi() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return base.includes('localhost') || base.includes('127.0.0.1');
}

function formatAuthError(err) {
  const status = err.response?.status;
  const serverMsg = err.response?.data?.message;

  if (status === 401) {
    return (
      serverMsg ||
      'Sign-in succeeded but the server rejected your session. On the live site, ask the admin to verify Render Firebase env vars (FIREBASE_PRIVATE_KEY).'
    );
  }
  if (status === 403) {
    return serverMsg || 'You do not have permission for this action.';
  }
  if (!err.response && err.message?.includes('Network')) {
    return 'Cannot reach the server. If you are on the live site, the API may be waking up — wait a moment and try again.';
  }
  return serverMsg || err.message || 'Request failed';
}

async function fetchMeWithRetry(firebaseUser) {
  const local = isLocalApi();
  const maxAttempts = local ? 2 : 4;
  const retryDelay = local ? 400 : 1500;

  await firebaseUser.getIdToken(true);
  let lastErr;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const { data } = await api.get('/auth/me');
      return data;
    } catch (err) {
      lastErr = err;
      if (i < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, retryDelay * (i + 1)));
      }
    }
  }
  const wrapped = new Error(formatAuthError(lastErr));
  wrapped.cause = lastErr;
  throw wrapped;
}

export function AuthProvider({ children }) {
  const [user,       setUser]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setConnecting(true);
        try {
          const data = await fetchMeWithRetry(firebaseUser);
          setUser(data);
        } catch {
          setUser(null);
        } finally {
          setConnecting(false);
        }
      } else {
        setUser(null);
        setConnecting(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const data = await fetchMeWithRetry(result.user);
    setUser(data);
    return data;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const data = await fetchMeWithRetry(result.user);
    setUser(data);
    return data;
  };

  const register = async (form) => {
    const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
    if (form.email.endsWith('@cvsu.edu.ph')) {
      await sendEmailVerification(result.user);
    }
    await result.user.getIdToken(true);
    const { data } = await api.post('/auth/register', form);
    setUser(data.user);
    return data;
  };

  const resendVerification = async () => {
    const cu = auth.currentUser;
    if (cu && !cu.emailVerified) {
      await sendEmailVerification(cu);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateUser = (u) => setUser(u);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{
      user, loading, connecting,
      login, loginWithGoogle, register, logout,
      updateUser, resendVerification,
    }}>
      {connecting && (
        <div className="fixed top-14 inset-x-0 z-[9998] pointer-events-none flex justify-center">
          <span className="text-xs bg-white/10 backdrop-blur-md border border-white/15 text-white/80 px-3 py-1 rounded-full">
            Connecting to server…
          </span>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
