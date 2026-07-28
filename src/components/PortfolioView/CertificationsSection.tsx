import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Award, ExternalLink, Calendar } from 'lucide-react';

const CertificationsSection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const { certifications } = data;
  const isDark = theme === 'dark';

  if (!certifications || certifications.length === 0) return null;

  const issuerColors: Record<string, string> = {
    'Amazon Web Services': isDark ? 'from-orange-600/20 to-amber-600/20 border-orange-500/30' : 'from-orange-50 to-amber-50 border-orange-200',
    'Google Cloud': isDark ? 'from-blue-600/20 to-cyan-600/20 border-blue-500/30' : 'from-blue-50 to-cyan-50 border-blue-200',
    'Cloud Native Computing Foundation': isDark ? 'from-cyan-600/20 to-teal-600/20 border-cyan-500/30' : 'from-cyan-50 to-teal-50 border-cyan-200',
    'Meta / Coursera': isDark ? 'from-blue-600/20 to-indigo-600/20 border-blue-500/30' : 'from-blue-50 to-indigo-50 border-blue-200',
  };
  const defaultGradient = isDark
    ? 'from-indigo-600/20 to-purple-600/20 border-indigo-500/30'
    : 'from-indigo-50 to-purple-50 border-indigo-200';

  return (
    <section
      id="certifications"
      className={`relative py-24 px-4 ${isDark ? 'bg-slate-900' : 'bg-transparent'}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${
            isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
          }`}>
            Credentials
          </span>
          <h2 className={`text-3xl sm:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Certifications
          </h2>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Continuous learning through industry-recognized programs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certifications.map((cert) => {
            const gradStyle = issuerColors[cert.issuer] ?? defaultGradient;
            return (
              <div
                key={cert.id}
                className={`flex flex-col rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${gradStyle} ${
                  isDark ? 'hover:shadow-slate-900/50' : 'hover:shadow-slate-200'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                  <Award size={20} className="text-white" />
                </div>

                <h3 className={`font-bold text-sm leading-snug mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {cert.title}
                </h3>

                <p className={`text-xs mb-3 flex-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {cert.issuer}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Calendar size={10} />
                    {cert.date}
                  </span>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      id={`cert-link-${cert.id}`}
                      className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                        isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'
                      }`}
                    >
                      Verify
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
