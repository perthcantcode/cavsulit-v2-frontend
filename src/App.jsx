import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineBanner } from './components/OfflineBanner';
import { LoadingScreen } from './components/ui/Loader';
import { Layout }        from './components/Layout';

const Landing       = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Browse        = lazy(() => import('./pages/Browse').then(m => ({ default: m.Browse })));
const ShopDetails   = lazy(() => import('./pages/ShopDetails').then(m => ({ default: m.ShopDetails })));
const PostShop      = lazy(() => import('./pages/PostShop').then(m => ({ default: m.PostShop })));
const EditShop      = lazy(() => import('./pages/EditShop').then(m => ({ default: m.EditShop })));
const MyShop        = lazy(() => import('./pages/MyShop').then(m => ({ default: m.MyShop })));
const Messages      = lazy(() => import('./pages/Messages').then(m => ({ default: m.Messages })));
const Wishlist      = lazy(() => import('./pages/Wishlist').then(m => ({ default: m.Wishlist })));
const VerifiedBadge = lazy(() => import('./pages/VerifiedBadge').then(m => ({ default: m.VerifiedBadge })));
const Profile       = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const LoginPage     = lazy(() => import('./pages/Auth').then(m => ({ default: m.Login })));
const RegisterPage  = lazy(() => import('./pages/Auth').then(m => ({ default: m.Register })));
const NotFound      = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center [background:var(--bg)]">
    <div className="w-8 h-8 border-4 [border-color:var(--accent)] border-t-transparent rounded-full animate-spin"/>
  </div>
);

export function App() {
  const [booted, setBooted] = useState(false);

  return (
    <ErrorBoundary>
      {!booted && <LoadingScreen onDone={() => setBooted(true)} />}
      {booted && (
        <AuthProvider>
          <BrowserRouter>
            <OfflineBanner />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={<Layout />}>
                  <Route index                element={<Landing />} />
                  <Route path="browse"        element={<Browse />} />
                  <Route path="shop/:id"      element={<ShopDetails />} />
                  <Route path="post-shop"     element={<PostShop />} />
                  <Route path="shop/:id/edit" element={<EditShop />} />
                  <Route path="my-shop"       element={<MyShop />} />
                  <Route path="messages"      element={<Messages />} />
                  <Route path="wishlist"      element={<Wishlist />} />
                  <Route path="verified"      element={<VerifiedBadge />} />
                  <Route path="profile"       element={<Profile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      )}
    </ErrorBoundary>
  );
}
