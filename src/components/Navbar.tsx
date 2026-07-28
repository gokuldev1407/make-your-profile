import React, { useState } from 'react';
import { Eye, Code2, Sun, Moon, FileDown, Download } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { exportDocx } from '../utils/exportDocx';
import { exportHtml } from '../utils/exportHtml';

const Navbar: React.FC = () => {
  const { mode, setMode, theme, toggleTheme, data } = usePortfolio();
  const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);


  const handleExportDocx = async () => {
    setExporting('docx');
    await exportDocx(data);
    setExporting(null);
    setExportMenuOpen(false);
  };

  const isDark = theme === 'dark';

  const handleExportHtml = () => {
    if (mode === 'edit') {
      setMode('preview');
      setTimeout(() => {
        exportHtml(data, isDark);
      }, 400);
    } else {
      exportHtml(data, isDark);
    }
    setExportMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/90 border-slate-700/60'
          : 'bg-[linear-gradient(to_right,#9df5f9f2,#c7dcfff2,#e4d4fff2,#ffccf0f2)] border-white/50 shadow-sm'
      } border-b backdrop-blur-xl`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span
              className={`font-bold text-lg tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Portfolio<span className="text-indigo-500">Builder</span>
            </span>
          </div>

          {/* Center: Mode Toggle */}
          <div
            className={`flex rounded-xl p-1 gap-1 ${
              isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}
          >
            <button
              id="mode-preview-btn"
              onClick={() => setMode('preview')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === 'preview'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye size={14} />
              Preview
            </button>
            <button
              id="mode-edit-btn"
              onClick={() => setMode('edit')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === 'edit'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Code2 size={14} />
              Edit JSON
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark
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
                onClick={() => setExportMenuOpen(o => !o)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
              >
                <Download size={15} />
                Export Resume
              </button>

              {exportMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-52 rounded-xl shadow-2xl border overflow-hidden z-50 ${
                    isDark
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}
                >

                  <button
                    id="export-docx-btn"
                    onClick={handleExportDocx}
                    disabled={exporting !== null}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                      isDark
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
                    id="export-html-btn"
                    onClick={handleExportHtml}
                    disabled={exporting !== null}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                      isDark
                        ? 'text-slate-200 hover:bg-slate-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    } ${exporting !== null ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Code2 size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <div>Download HTML</div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Standalone web page
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
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
