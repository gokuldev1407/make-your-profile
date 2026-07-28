import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { PortfolioData, AppMode, Theme } from '../types/portfolio';
import { defaultPortfolioData } from '../data/defaultData';

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (data: PortfolioData) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [mode, setMode] = useState<AppMode>('preview');
  const [theme, setTheme] = useState<Theme>('dark');

  const updateData = (newData: PortfolioData) => setData(newData);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <PortfolioContext.Provider value={{ data, updateData, mode, setMode, theme, toggleTheme }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider');
  return ctx;
};
