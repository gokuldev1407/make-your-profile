import type { PortfolioData } from '../types/portfolio';

export const defaultPortfolioData: PortfolioData = {
  personalInfo: {
    name: 'Gokul S',
    title: 'Software Developer | Full Stack Developer',
    email: 'gokul123@gmail.com',
    phone: '8667608443',
    location: 'Tamil Nadu, India',
    bio: 'Software Developer with 2 years of experience in designing and developing full-stack web applications. Experienced in Java, React, Angular, REST APIs, SQL, and document automation systems. Skilled in frontend component development, backend integration, automation testing, and building scalable business applications. Passionate about writing clean, maintainable code and continuously learning modern technologies like Spring Boot, Microservices, and AWS.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    socialLinks: {
      github: 'https://github.com/gokuls',
      linkedin: 'https://linkedin.com/in/gokuls',
      portfolio: '',
      twitter: '',
    },
  },
  skills: [
    {
      category: 'Programming Languages',
      items: ['Java', 'JavaScript', 'TypeScript', 'SQL'],
    },
    {
      category: 'Frontend',
      items: ['React', 'Angular', 'HTML5', 'CSS3', 'Bootstrap', 'Responsive Design'],
    },
    {
      category: 'Backend',
      items: ['Java', 'Spring Boot', 'REST APIs', 'JSON'],
    },
    {
      category: 'Database',
      items: ['MySQL', 'SQL'],
    },
    {
      category: 'Testing',
      items: ['Automation Testing', 'Manual Testing', 'Functional Testing', 'Regression Testing'],
    },
    {
      category: 'Tools',
      items: ['Git', 'GitHub', 'VS Code', 'Postman'],
    },
    {
      category: 'Learning',
      items: ['Microservices', 'AWS', 'Spring Security'],
    },
    {
      category: 'Soft Skills',
      items: ['Problem Solving', 'Team Collaboration', 'Quick Learner', 'Communication', 'Analytical Thinking'],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Current Organization',
      role: 'Software Developer',
      location: 'India',
      startDate: '2024',
      endDate: 'Present',
      current: true,
      achievements: [
        'Developed reusable UI components using Angular and React for enterprise web applications.',
        'Worked as a Full Stack Developer in a Document Automation System, implementing both frontend and backend functionalities.',
        'Designed and integrated REST APIs for seamless communication between frontend and backend systems.',
        'Participated in application enhancement, bug fixing, and performance optimization.',
        'Performed automation testing to improve software quality and reduce manual testing effort.',
        'Collaborated with cross-functional teams to understand business requirements and deliver scalable solutions.',
        'Maintained clean, modular, and reusable code following software development best practices.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Your College Name',
      degree: "Bachelor's Degree",
      field: 'Computer Science / Information Technology',
      location: 'India',
      startDate: '',
      endDate: '',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Document Automation System',
      description:
        'Enterprise document automation platform that enables users to generate, manage, and process business documents efficiently. Contributed as a Full Stack Developer by implementing frontend components, backend integration, API development, and automation testing.',
      techStack: ['Java', 'Spring Boot', 'React', 'Angular', 'REST API', 'SQL'],
      featured: true,
    },
    {
      id: 'proj-2',
      title: 'Angular Component Development',
      description:
        'Developed reusable Angular components with responsive UI, form validations, routing, and API integration to improve maintainability and consistency across applications.',
      techStack: ['Angular', 'TypeScript', 'HTML', 'CSS', 'REST API'],
      featured: true,
    },
    {
      id: 'proj-3',
      title: 'React Component Library',
      description:
        'Built reusable React components for enterprise applications with state management, API integration, and responsive user interfaces to enhance development productivity.',
      techStack: ['React', 'JavaScript', 'CSS', 'REST API'],
      featured: true,
    },
    {
      id: 'proj-4',
      title: 'Automation Testing',
      description:
        'Created and executed automation test cases for web applications to validate functionality, reduce regression issues, and improve software reliability.',
      techStack: ['Automation Testing', 'Java', 'SQL'],
      featured: false,
    },
  ],
  certifications: [],
};
