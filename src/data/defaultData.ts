import type { PortfolioData } from '../types/portfolio';

export const defaultPortfolioData: PortfolioData = {
  personalInfo: {
    name: 'Lyra Stardust',
    title: 'Quantum Architect & Time Traveler',
    email: 'lyra@multiverse.net',
    phone: '∑-999-∞',
    location: 'Neo-Tokyo, Mars Colony',
    bio: 'Pioneering the intersection of quantum mechanics and intergalactic web development. I specialize in building hyper-scale Dyson Sphere interfaces, time-bending algorithms, and telepathic UI/UX. When I am not debugging anomalies in the space-time continuum, I enjoy surfing solar flares and mentoring junior time travelers.',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    socialLinks: {
      github: 'https://github.com/lyra-stardust',
      linkedin: 'https://linkedin.com/in/lyrastardust',
      portfolio: '',
      twitter: '',
    },
  },
  skills: [
    {
      category: 'Core Competencies',
      items: ['Quantum Computing', 'Time Manipulation', 'Telepathic UI', 'Wormhole Routing'],
    },
    {
      category: 'Languages',
      items: ['Binary', 'Galactic Standard', 'Telepathy', 'TypeScript'],
    },
    {
      category: 'Technologies',
      items: ['React Space', 'Astro-Angular', 'Hyper-Node.js', 'Nebula DB'],
    },
    {
      category: 'Certifications',
      items: ['Class 4 Time Lord', 'Certified Warp Drive Mechanic'],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Galactic Federation',
      role: 'Lead Quantum Architect',
      location: 'Andromeda Galaxy',
      startDate: '2084',
      endDate: 'Present',
      current: true,
      achievements: [
        'Designed the core architecture for the Interstellar Communication Network.',
        'Reduced warp-drive fuel consumption by 40% through optimized pathfinding algorithms.',
        'Successfully debugged a paradox in sector 4 without disrupting the timeline.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Starfleet Academy',
      degree: 'Ph.D. in Multiversal Engineering',
      field: 'Applied Quantum Physics',
      location: 'Earth',
      startDate: '2078',
      endDate: '2082',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Dyson Sphere OS',
      description: 'An open-source operating system designed to manage the energy output of a Type II civilization star mega-structure.',
      techStack: ['Quantum Assembly', 'Nebula DB', 'Star-React'],
      featured: true,
    },
    {
      id: 'proj-2',
      title: 'Time-Traveling To-Do List',
      description: 'A productivity app that lets you assign tasks to your past self. Warning: may cause grandfather paradoxes.',
      techStack: ['Chronos Framework', 'TypeScript'],
      featured: true,
    },
  ],
  certifications: [],
};
