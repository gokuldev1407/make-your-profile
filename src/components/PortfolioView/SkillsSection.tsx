import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Zap, Code2, Users } from 'lucide-react';

const SkillsSection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const { skills, experience, projects } = data;
  const isDark = theme === 'dark';

  const stats = [
    { icon: Zap, label: 'Roles', value: `${experience.length}` },
    { icon: Code2, label: 'Projects Built', value: `${projects.length}+` },
    { icon: Users, label: 'Skill Categories', value: `${skills.length}` },
  ];

  const categoryColors: Record<string, string> = {
    Frontend: 'from-blue-500 to-cyan-500',
    Backend: 'from-purple-500 to-pink-500',
    'DevOps & Cloud': 'from-orange-500 to-amber-500',
    'Tools & Practices': 'from-emerald-500 to-teal-500',
    'Soft Skills': 'from-rose-500 to-pink-500',
  };

  const badgeColor: Record<string, string> = {
    Frontend: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200',
    Backend: isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200',
    'DevOps & Cloud': isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200',
    'Tools & Practices': isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Soft Skills': isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const defaultBadge = isDark
    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    : 'bg-indigo-50 text-indigo-700 border-indigo-200';

  return (
    <section
      id="skills"
      className={`relative py-24 px-4 ${isDark ? 'bg-slate-900' : 'bg-transparent'}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${
            isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
          }`}>
            Expertise
          </span>
          <h2 className={`text-3xl sm:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Skills & Technologies
          </h2>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className={`text-center p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700 hover:border-indigo-500/50'
                  : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                <Icon size={22} className="text-white" />
              </div>
              <div className={`text-3xl font-extrabold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {value}
              </div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
            </div>
          ))}
        </div>

        {/* Skill Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((cat, idx) => {
            const gradClass = categoryColors[cat.category] ?? 'from-indigo-500 to-purple-500';
            const badge = badgeColor[cat.category] ?? defaultBadge;
            return (
              <div
                key={idx}
                className={`rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-700 hover:shadow-indigo-900/30'
                    : 'bg-white border-slate-200 hover:shadow-slate-200'
                }`}
              >
                {/* Gradient top bar */}
                <div className={`h-1 bg-gradient-to-r ${gradClass}`} />
                <div className="p-5">
                  <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((skill, i) => (
                      <span
                        key={i}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${badge}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
