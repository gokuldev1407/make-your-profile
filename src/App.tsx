import React, { useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PortfolioView from './components/PortfolioView';
import AiEditor from './components/AiEditor';
import AuthScreen from './components/AuthScreen';
import { api } from './api';
import { Loader2 } from 'lucide-react';

const AppInner: React.FC = () => {
  const { mode, theme, loading } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const isDark = theme === 'dark';

  // Intelligent ping: only ping if there is 10 minutes of complete inactivity
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const INACTIVITY_THRESHOLD = 10 * 60 * 1000; // 10 minutes
    const CHECK_INTERVAL = 60 * 1000; // Check every 1 minute
    
    const intervalId = setInterval(() => {
      const timeSinceLastCall = Date.now() - api.getLastCallTime();
      if (timeSinceLastCall >= INACTIVITY_THRESHOLD) {
        api.ping();
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  if (!isAuthenticated) return <AuthScreen />;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <Navbar />
        <main>
          {mode === 'preview' ? (
            <div className="h-screen pt-20 px-2 pb-2">
              <div className={`h-full w-full max-w-8xl mx-auto rounded-2xl border overflow-hidden shadow-xl overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <PortfolioView />
              </div>
            </div>
          ) : (
            <AiEditor />
          )}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <PortfolioProvider>
      <AppInner />
    </PortfolioProvider>
  </AuthProvider>
);

export default App;
