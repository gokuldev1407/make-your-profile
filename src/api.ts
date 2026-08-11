import type { PortfolioData } from './types/portfolio';

// Track the last time a real API call was made to prevent unnecessary keep-alive pings
let lastApiCallTime = Date.now();

// Dynamically check if the user is on localhost
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// If they are local, use localhost. If they are in production, use the environment variable.
const API_BASE = isLocal 
  ? 'http://localhost:8080/api/v1' 
  : `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // We ignore keep-alive pings so they don't reset the activity timer
  if (!url.endsWith('/ping')) {
    lastApiCallTime = Date.now();
  }
  const res = await fetch(url, options);
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
    throw new Error('Session expired. Please log in again.');
  }
  return res;
};

export const api = {
  // --- Profiles ---
  getProfiles: async () => {
    const res = await fetchWithAuth(`${API_BASE}/profiles/my-profiles`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch profiles');
    return res.json();
  },
  createProfile: async (data: { title: string; profileData: string; themeConfig: string }) => {
    const res = await fetchWithAuth(`${API_BASE}/profiles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create profile');
    return res.json();
  },
  updateProfile: async (id: string, data: { title?: string; profileData?: string; themeConfig?: string }) => {
    const res = await fetchWithAuth(`${API_BASE}/profiles/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // --- AI ---
  aiUpdateProfile: async (currentData: PortfolioData, prompt: string): Promise<PortfolioData> => {
    const res = await fetchWithAuth(`${API_BASE}/ai/update-profile`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        originalText: JSON.stringify(currentData),
        context: prompt
      })
    });
    if (!res.ok) throw new Error('Failed to update profile via AI');
    const response = await res.json();
    
    try {
      // The AI might return the JSON wrapped in a string or directly.
      const jsonStr = response.data.generatedText;
      return JSON.parse(jsonStr) as PortfolioData;
    } catch (e) {
      console.error("AI did not return valid JSON:", response.data.generatedText);
      throw new Error("AI returned invalid JSON formatting");
    }
  },

  // --- Exports ---
  exportPdf: async (profileData: string) => {
    const res = await fetchWithAuth(`${API_BASE}/export/pdf`, {
      method: 'POST',
      headers: getHeaders(),
      body: profileData
    });
    if (!res.ok) throw new Error('Failed to export PDF');
    return res.blob();
  },
  exportDocx: async (profileData: string) => {
    const res = await fetchWithAuth(`${API_BASE}/export/docx`, {
      method: 'POST',
      headers: getHeaders(),
      body: profileData
    });
    if (!res.ok) throw new Error('Failed to export DOCX');
    return res.blob();
  },

  // --- Auth ---
  register: async (data: any) => {
    lastApiCallTime = Date.now();
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  login: async (data: any) => {
    lastApiCallTime = Date.now();
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  // --- Keep Alive ---
  getLastCallTime: () => lastApiCallTime,
  ping: async () => {
    try {
      await fetchWithAuth(`${API_BASE}/ping`, { method: 'GET' });
    } catch (e) {
      // Silently ignore ping errors to prevent console spam
    }
  }
};
