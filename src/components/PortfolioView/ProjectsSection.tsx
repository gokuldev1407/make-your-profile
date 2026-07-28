import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ExternalLink, GitFork, Star } from 'lucide-react';

const ProjectsSection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const { projects } = data;
  const isDark = theme === 'dark';

  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 3);

  const techColors: Record<string, string> = {
    'React': isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'TypeScript': isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200',
    'Next.js': isDark ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-slate-100 text-slate-700 border-slate-300',
    'Python': isDark ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Node.js': isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  const defaultTech = isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200';

  return (
    <section
      id="projects"
      className={`relative py-24 px-4 ${isDark ? 'bg-slate-900' : 'bg-transparent'}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${
            isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
          }`}>
            Portfolio
          </span>
          <h2 className={`text-3xl sm:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Featured Projects
          </h2>

        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((proj, idx) => (
            <div
              key={proj.id}
              className={`group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                isDark
                  ? 'bg-slate-800/60 border-slate-700 hover:border-indigo-500/40 hover:shadow-indigo-900/30'
                  : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-indigo-100'
              }`}
            >
              {/* Color top bar gradient based on index */}
              <div
                className={`h-1.5 ${
                  [
                    'bg-gradient-to-r from-indigo-500 to-purple-500',
                    'bg-gradient-to-r from-emerald-500 to-teal-500',
                    'bg-gradient-to-r from-orange-500 to-pink-500',
                    'bg-gradient-to-r from-blue-500 to-cyan-500',
                    'bg-gradient-to-r from-purple-500 to-rose-500',
                    'bg-gradient-to-r from-yellow-500 to-orange-500',
                  ][idx % 6]
                }`}
              />

              <div className="p-6 flex flex-col flex-1">
                {/* Title row */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-bold text-lg leading-tight group-hover:text-indigo-500 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {proj.title}
                  </h3>
                  {proj.featured && (
                    <span className={`ml-2 flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      <Star size={10} fill="currentColor" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed mb-4 flex-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {proj.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {proj.techStack.map((tech, ti) => (
                    <span
                      key={ti}
                      className={`text-xs font-medium px-2 py-0.5 rounded-md border ${techColors[tech] ?? defaultTech}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-700/30 mt-auto">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      id={`project-live-${proj.id}`}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 ${
                        isDark
                          ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
                      }`}
                    >
                      <ExternalLink size={12} />
                      Live Demo
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      id={`project-github-${proj.id}`}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 ${
                        isDark
                          ? 'text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <GitFork size={12} />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More */}
        {projects.length > 3 && (
          <div className="text-center mt-10">
            <button
              id="show-more-projects-btn"
              onClick={() => setShowAll(v => !v)}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 border hover:-translate-y-0.5 ${
                isDark
                  ? 'border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400'
                  : 'border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {showAll ? `Show Less` : `Show All ${projects.length} Projects`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
