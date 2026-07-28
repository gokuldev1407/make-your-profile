import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import HeroSection from './HeroSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectsSection';
import EducationSection from './EducationSection';
import CertificationsSection from './CertificationsSection';
import ContactSection from './ContactSection';

const PortfolioView: React.FC = () => {
  const { theme } = usePortfolio();
  const isDark = theme === 'dark';

  return (
    <div 
      id="portfolio-view" 
      className={`scroll-smooth ${
        isDark 
          ? 'bg-slate-950 text-white' 
          : 'bg-[linear-gradient(to_right,#9df5f9,#c7dcff,#e4d4ff,#ffccf0)] text-slate-800'
      }`}
    >
      <HeroSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <EducationSection />
      <CertificationsSection />
      <ContactSection />
    </div>
  );
};

export default PortfolioView;
