import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PortfolioView from './components/PortfolioView';
import AiEditor from './components/AiEditor';
import AuthScreen from './components/AuthScreen';
import { Loader2 } from 'lucide-react';

const AppInner: React.FC = () => {
  const { mode, theme, loading } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const isDark = theme === 'dark';

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
            <div className="pt-20 px-4 pb-6">
              <div className="bubble-card w-full max-w-8xl mx-auto">
                <div className={`bubble-card-inner shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                  <PortfolioView />
                </div>
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
