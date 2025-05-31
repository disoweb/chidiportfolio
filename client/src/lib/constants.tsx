import { Skill, Project, Experience } from './types';

export const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 90, icon: 'Code', category: 'frontend' },
  { name: 'JavaScript', level: 95, icon: 'Code2', category: 'frontend' },
  { name: 'TypeScript', level: 85, icon: 'FileCode', category: 'frontend' },
  { name: 'HTML/CSS', level: 92, icon: 'Globe', category: 'frontend' },
  
  // Backend
  { name: 'PHP', level: 85, icon: 'Server', category: 'backend' },
  { name: 'Laravel', level: 80, icon: 'Layers', category: 'backend' },
  { name: 'Node.js', level: 85, icon: 'Terminal', category: 'backend' },
  { name: 'Express.js', level: 82, icon: 'Zap', category: 'backend' },
  
  // Database
  { name: 'MySQL', level: 88, icon: 'Database', category: 'database' },
  { name: 'PostgreSQL', level: 80, icon: 'HardDrive', category: 'database' },
  
  // Tools
  { name: 'Git', level: 92, icon: 'GitBranch', category: 'tools' },
  { name: 'Docker', level: 75, icon: 'Container', category: 'tools' },
  { name: 'AWS', level: 70, icon: 'Cloud', category: 'tools' },
  
  // Engineering
  { name: 'Solar Systems', level: 88, icon: 'Sun', category: 'engineering' },
  { name: 'Microgrids', level: 82, icon: 'Zap', category: 'engineering' },
  { name: 'Embedded Systems', level: 75, icon: 'Cpu', category: 'engineering' },
];

export const projects: Project[] = [
  {
    id: 'biometric-voting',
    title: 'Automated Biometric Voting Machine',
    description: 'Pioneered the development of a secure, automated voting system using biometric authentication to ensure election integrity and eliminate voter fraud. Successfully piloted in 2016 with comprehensive security protocols.',
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    technologies: ['Embedded C', 'Biometric SDK', 'Security Protocols', 'Hardware Integration'],
    featured: true,
    metrics: [
      { label: 'Accuracy Rate', value: '99.8%' },
      { label: 'Security Breaches', value: '0' },
      { label: 'Voters Processed', value: '1000+' }
    ]
  },
  {
    id: 'solar-monitoring',
    title: 'Solar Monitoring Dashboard',
    description: 'Real-time monitoring system for solar installations with predictive maintenance alerts and performance optimization.',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    technologies: ['React', 'Node.js', 'IoT', 'Real-time Analytics'],
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'smart-grid',
    title: 'Smart Grid Controller',
    description: 'Intelligent control system for microgrid management with automated load balancing and energy optimization.',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    technologies: ['C++', 'Arduino', 'MQTT', 'IoT'],
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'ecommerce-platform',
    title: 'Enterprise E-commerce',
    description: 'Full-stack e-commerce solution with advanced inventory management, payment processing, and analytics dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    technologies: ['Laravel', 'Vue.js', 'MySQL', 'Stripe API'],
    demoUrl: '#',
    githubUrl: '#'
  }
];

export const experiences: Experience[] = [
  {
    id: 'senior-fullstack',
    title: 'Senior Fullstack Developer',
    company: 'Technology Solutions Inc.',
    period: '2020 - Present',
    description: 'Leading development of enterprise web applications and solar energy management systems. Architected scalable solutions serving 10,000+ users with 99.9% uptime.',
    technologies: ['React', 'Node.js', 'AWS', 'PostgreSQL'],
    achievements: [
      'Increased system performance by 40%',
      'Led team of 5 developers',
      'Implemented CI/CD pipelines'
    ]
  },
  {
    id: 'software-engineer',
    title: 'Software & Systems Engineer',
    company: 'Green Energy Solutions',
    period: '2018 - 2020',
    description: 'Developed embedded systems for solar panel monitoring and microgrid control. Implemented IoT solutions that improved system efficiency by 25%.',
    technologies: ['C++', 'Arduino', 'IoT', 'Python'],
    achievements: [
      'Improved energy efficiency by 25%',
      'Deployed 50+ IoT devices',
      'Reduced maintenance costs by 30%'
    ]
  },
  {
    id: 'junior-developer',
    title: 'Junior Developer',
    company: 'Democratic Systems Corp',
    period: '2016 - 2018',
    description: 'Pioneered biometric voting machine development. Led the 2016 pilot project that processed 1000+ votes with 99.8% accuracy and zero security breaches.',
    technologies: ['Embedded C', 'Security', 'Biometrics', 'Hardware'],
    achievements: [
      '99.8% accuracy rate achieved',
      'Zero security incidents',
      'Successfully piloted voting system'
    ]
  }
];

export const socialLinks = {
  linkedin: 'https://linkedin.com/in/chidiogara',
  github: 'https://github.com/chidiogara',
  email: 'hello@chidiogara.dev',
  phone: '+1 (555) 123-4567'
};

export const resumeUrl = '#'; // This would be the actual resume download URL
