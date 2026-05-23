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

async function fetchMeWithRetry(firebaseUser, maxAttempts = 4) {
  await firebaseUser.getIdToken(true);
  let lastErr;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const { data } = await api.get('/auth/me');
      return data;
    } catch (err) {
      lastErr = err;
      if (i < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
      }
    }
  }
  throw lastErr;
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
          // Backend may still be waking — keep Firebase session, retry in background
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
