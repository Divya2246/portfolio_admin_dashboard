import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../common/layouts';
import { DashboardPage, PreviewPage, MessagesPage, LoginPage } from '../pages';
import { ROUTES } from '../constants';
import { subscribeToAuthChanges } from '../firebase/services/auth.service';
import type { User } from 'firebase/auth';
import { useAppDispatch } from '../redux';
import { fetchPortfolio } from '../redux/slices/portfolioSlice';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(u);
      setAuthReady(true);
    });
    // If Firebase Auth isn't available (e.g. missing env vars on Vercel),
    // the callback is never called — set authReady so the app can render.
    if (!unsubscribe) {
      setAuthReady(true);
    }
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (user?.uid) dispatch(fetchPortfolio(user.uid));
  }, [user?.uid, dispatch]);

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <span className="text-sm text-muted">Loading…</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={user ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginPage />} />
        <Route
          path="/*"
          element={
            user ? (
              <MainLayout>
                <Routes>
                  <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                  <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                  <Route path={ROUTES.PREVIEW} element={<PreviewPage />} />
                  <Route path={ROUTES.MESSAGES} element={<MessagesPage />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
