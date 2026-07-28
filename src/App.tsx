import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import PortfolioView from './components/PortfolioView';
import JsonEditor from './components/JsonEditor';

const AppInner: React.FC = () => {
  const { mode, theme } = usePortfolio();
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <Navbar />
        <main>
          {mode === 'preview' ? (
            <div className="pt-16">
              <PortfolioView />
            </div>
          ) : (
            <JsonEditor />
          )}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <PortfolioProvider>
    <AppInner />
  </PortfolioProvider>
);

export default App;
