import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Mail, Phone, MapPin, Globe, Send } from 'lucide-react';

// Custom SVG Social Icons
const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const ContactSection: React.FC = () => {
  const { data, theme } = usePortfolio();
  const { personalInfo } = data;
  const isDark = theme === 'dark';

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone}`,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: personalInfo.location,
      href: `https://maps.google.com/?q=${encodeURIComponent(personalInfo.location)}`,
      color: 'from-blue-500 to-indigo-500',
    },
  ];

  const socialItems: { icon: React.ElementType; label: string; href: string; color: string }[] = [
    ...(personalInfo.socialLinks.github
      ? [{ icon: GithubIcon, label: 'GitHub', href: personalInfo.socialLinks.github, color: isDark ? 'hover:bg-slate-700 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900' }]
      : []),
    ...(personalInfo.socialLinks.linkedin
      ? [{ icon: LinkedInIcon, label: 'LinkedIn', href: personalInfo.socialLinks.linkedin, color: isDark ? 'hover:bg-blue-500/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600' }]
      : []),
    ...(personalInfo.socialLinks.portfolio
      ? [{ icon: Globe, label: 'Portfolio', href: personalInfo.socialLinks.portfolio, color: isDark ? 'hover:bg-indigo-500/10 hover:text-indigo-400' : 'hover:bg-indigo-50 hover:text-indigo-600' }]
      : []),
    ...(personalInfo.socialLinks.twitter
      ? [{ icon: TwitterIcon, label: 'Twitter / X', href: personalInfo.socialLinks.twitter, color: isDark ? 'hover:bg-sky-500/10 hover:text-sky-400' : 'hover:bg-sky-50 hover:text-sky-600' }]
      : []),
  ];

  return (
    <section
      id="contact"
      className={`py-24 px-4 ${
        isDark ? 'bg-slate-950' : 'relative bg-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${
            isDark ? 'bg-pink-500/10 text-pink-400' : 'bg-pink-50 text-pink-600'
          }`}>
            Let's Connect
          </span>
          <h2 className={`text-3xl sm:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Get In Touch
          </h2>

        </div>

        {/* CTA card */}
        <div className={`relative rounded-3xl overflow-hidden mb-8 ${
          isDark
            ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-700/50'
            : 'bg-gradient-to-br from-indigo-600 to-purple-700'
        }`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative z-10 p-8 sm:p-12 text-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {personalInfo.name}
            </h3>
            <p className={`mb-8 ${isDark ? 'text-indigo-300' : 'text-indigo-100'}`}>
              {personalInfo.title}
            </p>
            <a
              href={`mailto:${personalInfo.email}`}
              id="contact-email-cta-btn"
              className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${
                isDark ? 'bg-white text-indigo-900 hover:shadow-white/20' : 'bg-white text-indigo-700 hover:shadow-white/30'
              }`}
            >
              <Send size={16} />
              {personalInfo.email}
            </a>
          </div>
        </div>

        {/* Contact cards grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {contactItems.map(({ icon: Icon, label, value, href, color }) => (
            <a
              key={label}
              href={href}
              target={label === 'Location' ? '_blank' : undefined}
              rel="noreferrer"
              id={`contact-${label.toLowerCase()}-link`}
              className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600 hover:shadow-slate-900/50'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Icon size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {label}
                </p>
                <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {socialItems.map(({ icon: Icon, label, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              id={`contact-social-${label.toLowerCase().replace(/\s+/g, '-')}-link`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all duration-150 ${
                isDark
                  ? `text-slate-400 border-slate-700 ${color}`
                  : `text-slate-500 border-slate-200 ${color}`
              }`}
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className={`text-center mt-16 pt-8 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <p className={`text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            Built with ❤️ using React, TypeScript & Tailwind CSS
          </p>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
