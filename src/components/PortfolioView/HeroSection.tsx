import React from 'react';
import { MapPin, Mail, Phone, Globe, ChevronDown } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

// Custom SVG icon components (lucide-react doesn't have Github/LinkedIn/Twitter)
const GithubIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const HeroSection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const { personalInfo } = data;
  const isDark = theme === 'dark';

  const initials = personalInfo.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <section
      id="about"
      className={`relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden top-0 ${isDark
          ? 'bg-slate-950'
          : 'bg-transparent'
        }`}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-400/40'}`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-purple-600/20' : 'bg-fuchsia-400/40'}`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${isDark ? 'bg-indigo-500/5' : 'bg-sky-300/30'}`} />
        {!isDark && <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Avatar */}
        <div className="m-6 flex justify-center">
          <div className="relative">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-2xl shadow-indigo-500/40 ring-4 ring-indigo-500/30 overflow-hidden">
              {personalInfo.avatar ? (
                <img src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Name */}
        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-none ${isDark ? 'text-white' : 'text-slate-900'
          }`}>
          {personalInfo.name.split(' ').map((word, i) => (
            <span key={i}>
              {i === 1 ? (
                <span className="gradient-text">
                  {' '}{word}
                </span>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>

        {/* Title */}
        <p className={`text-lg sm:text-2xl font-medium mb-6 ${isDark ? 'text-indigo-300' : 'text-indigo-600'
          }`}>
          {personalInfo.title}
        </p>

        {/* Location */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          <MapPin size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {personalInfo.location}
          </span>
        </div>

        {/* Bio */}
        <p className={`text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
          {personalInfo.bio}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <a
            href={`mailto:${personalInfo.email}`}
            id="hero-email-btn"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
          >
            <Mail size={16} />
            Get In Touch
          </a>
          {personalInfo.socialLinks.portfolio && (
            <a
              href={personalInfo.socialLinks.portfolio}
              target="_blank"
              rel="noreferrer"
              id="hero-portfolio-btn"
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border hover:-translate-y-0.5 ${isDark
                  ? 'border-slate-600 text-slate-200 hover:border-indigo-500 hover:bg-indigo-500/10'
                  : 'border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
            >
              <Globe size={16} />
              View Portfolio
            </a>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {personalInfo.socialLinks.github && (
            <a href={personalInfo.socialLinks.github} target="_blank" rel="noreferrer" id="hero-github-link"
              className={`p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              title="GitHub">
              <GithubIcon size={22} />
            </a>
          )}
          {personalInfo.socialLinks.linkedin && (
            <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noreferrer" id="hero-linkedin-link"
              className={`p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                }`}
              title="LinkedIn">
              <LinkedInIcon size={22} />
            </a>
          )}
          {personalInfo.socialLinks.twitter && (
            <a href={personalInfo.socialLinks.twitter} target="_blank" rel="noreferrer" id="hero-twitter-link"
              className={`p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'text-slate-400 hover:text-sky-400 hover:bg-slate-800' : 'text-slate-500 hover:text-sky-500 hover:bg-slate-100'
                }`}
              title="Twitter / X">
              <TwitterIcon size={22} />
            </a>
          )}
          {personalInfo.socialLinks.portfolio && (
            <a href={personalInfo.socialLinks.portfolio} target="_blank" rel="noreferrer" id="hero-portfolio-icon-link"
              className={`p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
                }`}
              title="Portfolio">
              <Globe size={22} />
            </a>
          )}
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} id="hero-email-icon-link"
              className={`p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100'
                }`}
              title="Email">
              <Mail size={22} />
            </a>
          )}
          {personalInfo.phone && (
            <a href={`tel:${personalInfo.phone}`} id="hero-phone-link"
              className={`p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800' : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-100'
                }`}
              title="Phone">
              <Phone size={22} />
            </a>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={24} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
      </div>
    </section>
  );
};

export default HeroSection;
