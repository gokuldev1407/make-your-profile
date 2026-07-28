import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';

const EducationSection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const { education } = data;
  const isDark = theme === 'dark';

  return (
    <section
      id="education"
      className={`py-24 px-4 ${
        isDark ? 'bg-slate-950' : 'relative bg-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${
            isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
            Background
          </span>
          <h2 className={`text-3xl sm:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Education
          </h2>
        </div>

        <div className="space-y-6">
          {education.map(edu => (
            <div
              key={edu.id}
              className={`rounded-2xl border p-6 sm:p-8 transition-all duration-200 hover:shadow-xl ${
                isDark
                  ? 'bg-slate-800/60 border-slate-700 hover:border-blue-500/40 hover:shadow-blue-900/20'
                  : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-blue-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <GraduationCap size={26} className="text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {edu.institution}
                      </p>
                    </div>
                    {edu.gpa && (
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-bold ${
                        isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        <Award size={14} />
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>

                  <div className={`flex flex-wrap gap-4 text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {edu.startDate} – {edu.endDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      {edu.location}
                    </span>
                  </div>

                  {edu.details && edu.details.length > 0 && (
                    <ul className="space-y-2">
                      {edu.details.map((d, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
