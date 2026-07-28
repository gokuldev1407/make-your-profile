import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { MapPin, Calendar, CheckCircle2, ExternalLink } from 'lucide-react';

const ExperienceSection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const { experience } = data;
  const isDark = theme === 'dark';

  return (
    <section
      id="experience"
      className={`py-24 px-4 ${
        isDark ? 'bg-slate-950' : 'relative bg-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${
            isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
          }`}>
            Work History
          </span>
          <h2 className={`text-3xl sm:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Professional Experience
          </h2>

        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className={`absolute left-6 top-0 bottom-0 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

          <div className="space-y-10">
            {experience.map((exp, idx) => (
              <div key={exp.id} className="relative pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-6 w-12 h-12 rounded-xl flex items-center justify-center border-2 z-10 ${
                  exp.current
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-500 shadow-lg shadow-indigo-500/30'
                    : isDark
                    ? 'bg-slate-800 border-slate-600'
                    : 'bg-white border-slate-300'
                }`}>
                  <span className={`text-sm font-bold ${exp.current ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {String(experience.length - idx).padStart(2, '0')}
                  </span>
                </div>

                {/* Card */}
                <div className={`rounded-2xl border p-6 transition-all duration-200 hover:shadow-xl ${
                  isDark
                    ? 'bg-slate-800/60 border-slate-700 hover:border-indigo-500/40 hover:shadow-indigo-900/20'
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-slate-200'
                }`}>
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2">
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1`}
                          >
                            {exp.company}
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="font-semibold text-indigo-500">{exp.company}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-1.5">
                      {exp.current && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Current
                        </span>
                      )}
                      <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Calendar size={12} />
                        {exp.startDate} – {exp.endDate}
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <MapPin size={12} />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`h-px mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`} />

                  {/* Achievements */}
                  <ul className="space-y-2.5">
                    {exp.achievements.map((ach, ai) => (
                      <li key={ai} className="flex items-start gap-3">
                        <CheckCircle2 size={15} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                        <span className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {ach}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
