// ============================================================
// Resume Template Definitions
// Used by exportDocx (color constants) and exportPdf (CSS overrides)
// ============================================================

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  /** Preview card accent color (CSS color string) */
  previewPrimary: string;
  previewAccent: string;
  previewBg: string;
  /** DOCX color constants (hex without #) */
  colors: {
    primary: string;     // section labels, links
    primaryDark: string; // header shading, skill category
    accent: string;      // header banner background
    gray: string;        // secondary text
    grayLight: string;   // separators, muted text
    lightBg: string;     // contact bar background
    white: string;
    black: string;
    border: string;
    success: string;
    headerText: string;  // title text in header (lighter shade)
  };
  /** CSS variables injected for PDF DOM-capture (applied to #portfolio-view) */
  cssOverrides: Record<string, string>;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'indigo-pro',
    name: 'Indigo Pro',
    description: 'Modern indigo & navy — ATS-friendly',
    previewPrimary: '#6366f1',
    previewAccent: '#1e1b4b',
    previewBg: '#f8fafc',
    colors: {
      primary:     '6366F1',
      primaryDark: '4F46E5',
      accent:      '1E1B4B',
      gray:        '64748B',
      grayLight:   '94A3B8',
      lightBg:     'F1F5F9',
      white:       'FFFFFF',
      black:       '0F172A',
      border:      'E2E8F0',
      success:     '10B981',
      headerText:  'C7D2FE',
    },
    cssOverrides: {
      '--t-primary':  '#6366f1',
      '--t-accent':   '#4f46e5',
      '--t-header':   '#1e1b4b',
    },
  },
  {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    description: 'Deep navy with gold accents — executive',
    previewPrimary: '#f59e0b',
    previewAccent: '#0f172a',
    previewBg: '#1e293b',
    colors: {
      primary:     'F59E0B',
      primaryDark: 'D97706',
      accent:      '0F172A',
      gray:        '94A3B8',
      grayLight:   '64748B',
      lightBg:     '1E293B',
      white:       'FFFFFF',
      black:       'F1F5F9',
      border:      '334155',
      success:     '34D399',
      headerText:  'FDE68A',
    },
    cssOverrides: {
      '--t-primary':  '#f59e0b',
      '--t-accent':   '#d97706',
      '--t-header':   '#0f172a',
    },
  },
  {
    id: 'emerald-clean',
    name: 'Emerald Clean',
    description: 'Minimal white with emerald accents — fresh',
    previewPrimary: '#10b981',
    previewAccent: '#065f46',
    previewBg: '#f0fdf4',
    colors: {
      primary:     '10B981',
      primaryDark: '059669',
      accent:      '064E3B',
      gray:        '6B7280',
      grayLight:   '9CA3AF',
      lightBg:     'ECFDF5',
      white:       'FFFFFF',
      black:       '111827',
      border:      'D1FAE5',
      success:     '34D399',
      headerText:  'A7F3D0',
    },
    cssOverrides: {
      '--t-primary':  '#10b981',
      '--t-accent':   '#059669',
      '--t-header':   '#064e3b',
    },
  },
  {
    id: 'rose-executive',
    name: 'Rose Executive',
    description: 'Rose-crimson & charcoal — bold & elegant',
    previewPrimary: '#e11d48',
    previewAccent: '#1c1917',
    previewBg: '#fff1f2',
    colors: {
      primary:     'E11D48',
      primaryDark: 'BE123C',
      accent:      '1C1917',
      gray:        '78716C',
      grayLight:   'A8A29E',
      lightBg:     'FFF1F2',
      white:       'FFFFFF',
      black:       '1C1917',
      border:      'FCE7F3',
      success:     '10B981',
      headerText:  'FECDD3',
    },
    cssOverrides: {
      '--t-primary':  '#e11d48',
      '--t-accent':   '#be123c',
      '--t-header':   '#1c1917',
    },
  },
  {
    id: 'amber-warm',
    name: 'Amber Warm',
    description: 'Warm amber & orange — creative & vibrant',
    previewPrimary: '#f97316',
    previewAccent: '#7c2d12',
    previewBg: '#fffbeb',
    colors: {
      primary:     'F97316',
      primaryDark: 'EA580C',
      accent:      '7C2D12',
      gray:        '78716C',
      grayLight:   'A8A29E',
      lightBg:     'FFF7ED',
      white:       'FFFFFF',
      black:       '1C1917',
      border:      'FED7AA',
      success:     '16A34A',
      headerText:  'FED7AA',
    },
    cssOverrides: {
      '--t-primary':  '#f97316',
      '--t-accent':   '#ea580c',
      '--t-header':   '#7c2d12',
    },
  },
];
