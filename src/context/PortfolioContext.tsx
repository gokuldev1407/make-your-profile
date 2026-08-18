import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { PortfolioData, AppMode, Theme } from '../types/portfolio';
import { defaultPortfolioData } from '../data/defaultData';
import { api } from '../api';
import { useAuth } from './AuthContext';

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (data: PortfolioData) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  theme: Theme;
  toggleTheme: () => void;
  loading: boolean;
  saveData: (newData: PortfolioData) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [mode, setMode] = useState<AppMode>('preview');
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user) {
        const savedDraft = localStorage.getItem('portfolioDraft');
        if (savedDraft) {
          try {
            setData(JSON.parse(savedDraft));
          } catch (e) {
            console.error("Failed to parse local draft", e);
          }
        }
        setLoading(false);
        return;
      }
      
      try {
        const res = await api.getProfile();
        if (res.data) {
          const profile = res.data;
          setProfileId(profile.id);
          if (profile.profileData) {
            setData(JSON.parse(profile.profileData));
          }
          if (profile.themeConfig) {
            const tc = JSON.parse(profile.themeConfig);
            if (tc.theme) setTheme(tc.theme);
          }
        } else {
          // No profile exists, create one
          const newProfile = await api.createProfile({
            title: "Lyra's Quantum Portfolio",
            profileData: JSON.stringify(defaultPortfolioData),
            themeConfig: JSON.stringify({ theme: 'light' })
          });
          setProfileId(newProfile.data.id);
          setData(defaultPortfolioData);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    
    setLoading(true);
    fetchProfile();
  }, [user, isAuthenticated]);

  // Auto-save effect for debounced API updates and local storage drafts
  useEffect(() => {
    if (loading) return; // Prevent overwriting during initial load
    
    // Always save latest state to local draft
    localStorage.setItem('portfolioDraft', JSON.stringify(data));
    
    // Auto-sync with backend if authenticated
    if (isAuthenticated && profileId) {
      const handler = setTimeout(() => {
        api.updateProfile(profileId, {
          profileData: JSON.stringify(data),
          themeConfig: JSON.stringify({ theme })
        }).catch(err => console.error("Auto-save failed", err));
      }, 1000);
      
      return () => clearTimeout(handler);
    }
  }, [data, theme, isAuthenticated, profileId, loading]);

  const updateData = (newData: PortfolioData) => setData(newData);
  
  const saveData = async (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem('portfolioDraft', JSON.stringify(newData));
    if (profileId) {
      await api.updateProfile(profileId, {
        profileData: JSON.stringify(newData),
        themeConfig: JSON.stringify({ theme })
      });
    }
  };

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <PortfolioContext.Provider value={{ data, updateData, mode, setMode, theme, toggleTheme, loading, saveData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider');
  return ctx;
};
