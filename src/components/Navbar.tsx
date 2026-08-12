import React, { useState } from 'react';
import { Download, Eye, FileDown, Moon, Sun, Code2, LogOut, Loader2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { exportHtml } from '../utils/exportHtml';
import { exportPdf } from '../utils/exportPdf';
import { exportDocx } from '../utils/exportDocx';

const Navbar: React.FC = () => {
  const { mode, setMode, theme, toggleTheme, data } = usePortfolio();
  const { logout, user } = useAuth();
  const [exporting, setExporting] = useState<'pdf' | 'docx' | 'html' | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const handleSelectExportType = async (type: 'resume-docx' | 'resume-pdf' | 'portfolio-html') => {
    setExportMenuOpen(false);

    // Auto-switch to preview mode if currently in edit mode so DOM element exists
    if ((type === 'resume-pdf' || type === 'portfolio-html') && mode !== 'preview') {
      setMode('preview');
      await new Promise(r => setTimeout(r, 250));
    }

    if (type === 'resume-docx') {
      setExporting('docx');
      await new Promise(r => setTimeout(r, 500)); // Ensure spinner is visible for at least 500ms
      try {
        await exportDocx(data);
      } catch (e) {
        console.error(e);
        alert('Failed to export DOCX');
      }
      setExporting(null);
    } else if (type === 'resume-pdf') {
      setExporting('pdf');
      try {
        await exportPdf(data);
      } catch (e) {
        console.error(e);
        alert('Failed to export PDF');
      }
      setExporting(null);
    } else if (type === 'portfolio-html') {
      setExporting('html');
      await new Promise(r => setTimeout(r, 500)); // Give React time to render the spinner, making it visible to the user
      try {
        exportHtml(data, isDark);
      } catch (e) {
        console.error(e);
        alert('Failed to export HTML');
      }
      setExporting(null);
    }
  };

  return (
    <nav
      className={`fixed top-[7px] z-50 transition-all duration-300 rounded-2xl border backdrop-blur-xl ${isDark
        ? 'bg-slate-900/90 border-slate-700/60'
        : 'bg-[linear-gradient(to_right,#9df5f9f2,#c7dcfff2,#e4d4fff2,#ffccf0f2)] border-white/50 shadow-md'
        } left-2 right-2 mx-auto ${mode === 'preview' ? 'max-w-8xl' : ''}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md hover:scale-110 transition-transform duration-300">
              <defs>
                <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="loopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>

              <g>
                {/* Loop */}
                <path d="M 30 25 L 50 25 A 20 20 0 0 1 70 45 A 20 20 0 0 1 50 65 L 30 65" fill="none" stroke="url(#loopGrad)" strokeWidth="16" />
                
                {/* Stem */}
                <path d="M 30 20 L 30 80" fill="none" stroke="url(#stemGrad)" strokeWidth="16" strokeLinecap="round" />
              </g>
            </svg>
            <span
              className={`hidden sm:block font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              MakeYour<span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent ml-[1px]">Profile</span>
            </span>
          </div>

          {/* Center: Mode Toggle */}
          <div
            className={`flex rounded-xl p-1 gap-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'
              }`}
          >
            <button
              id="mode-preview-btn"
              onClick={() => setMode('preview')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${mode === 'preview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <Eye size={14} />
              <span className="hidden lg:inline">Preview</span>
            </button>
            <button
              id="mode-edit-btn"
              onClick={() => setMode('edit')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${mode === 'edit'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <Code2 size={14} />
              <span className="hidden lg:inline">Edit</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${isDark
                ? 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800'
                : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
                }`}
              title="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Export Menu */}
            <div className="relative">
              <button
                id="export-menu-btn"
                onClick={() => !exporting && setExportMenuOpen(o => !o)}
                disabled={exporting !== null}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 ${exporting !== null ? 'opacity-80 cursor-wait' : ''}`}
              >
                {exporting !== null ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Download size={15} />
                )}
                <span className="hidden lg:inline">
                  {exporting !== null ? 'Exporting...' : 'Export Resume'}
                </span>
              </button>

              {exportMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-52 rounded-xl shadow-2xl border overflow-hidden z-50 ${isDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200'
                    }`}
                >

                  <button
                    id="export-docx-btn"
                    onClick={() => handleSelectExportType('resume-docx')}
                    disabled={exporting !== null}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors duration-150 ${isDark
                      ? 'text-slate-200 hover:bg-slate-700'
                      : 'text-slate-700 hover:bg-slate-50'
                      } ${exporting !== null ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FileDown size={16} className="text-blue-500" />
                    </div>
                    <div className="text-left">
                      <div>{exporting === 'docx' ? 'Generating…' : 'Download Word'}</div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        ATS-friendly .docx
                      </div>
                    </div>
                  </button>

                  <div className={`h-px mx-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`} />

                  <button
                    id="export-pdf-btn"
                    onClick={() => handleSelectExportType('resume-pdf')}
                    disabled={exporting !== null}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors duration-150 ${isDark
                      ? 'text-slate-200 hover:bg-slate-700'
                      : 'text-slate-700 hover:bg-slate-50'
                      } ${exporting !== null ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Code2 size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <div>{exporting === 'pdf' ? 'Generating…' : 'Download PDF'}</div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Print-ready format
                      </div>
                    </div>
                  </button>

                  <div className={`h-px mx-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`} />

                  <button
                    id="export-html-btn"
                    onClick={() => handleSelectExportType('portfolio-html')}
                    disabled={exporting !== null}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors duration-150 ${isDark
                      ? 'text-slate-200 hover:bg-slate-700'
                      : 'text-slate-700 hover:bg-slate-50'
                      } ${exporting !== null ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Code2 size={16} className="text-orange-500" />
                    </div>
                    <div className="text-left">
                      <div>{exporting === 'html' ? 'Generating…' : 'Download HTML'}</div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Standalone Web Page
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            {user && (
              <button
                onClick={logout}
                className={`flex items-center gap-2 p-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${isDark
                  ? 'text-red-400 hover:bg-slate-800 hover:text-red-300'
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  }`}
                title="Log out"
              >
                <LogOut size={16} />
                <span className="hidden lg:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Close export menu on outside click */}
      {exportMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
