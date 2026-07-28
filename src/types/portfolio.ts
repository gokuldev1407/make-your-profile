// ============================================================
// TypeScript Interfaces for Portfolio Builder & Resume Generator
// ============================================================

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  twitter?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar?: string; // URL or base64
  socialLinks: SocialLinks;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string; // e.g., "Jan 2022"
  endDate: string;   // e.g., "Present" or "Dec 2023"
  current: boolean;
  achievements: string[];
  companyUrl?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  details?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}

export type AppMode = 'preview' | 'edit';
export type Theme = 'dark' | 'light';
