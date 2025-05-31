import { Skill, Project, Experience, Service } from './types';

export const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 95, icon: 'Code', category: 'frontend' },
  { name: 'Next.js', level: 92, icon: 'Globe', category: 'frontend' },
  { name: 'Vue.js', level: 88, icon: 'Code2', category: 'frontend' },
  { name: 'TypeScript', level: 90, icon: 'FileCode', category: 'frontend' },
  { name: 'Tailwind CSS', level: 95, icon: 'Palette', category: 'frontend' },
  { name: 'JavaScript', level: 98, icon: 'Code', category: 'frontend' },
  
  // Backend
  { name: 'Node.js', level: 92, icon: 'Server', category: 'backend' },
  { name: 'Express.js', level: 90, icon: 'Zap', category: 'backend' },
  { name: 'PHP', level: 85, icon: 'Server', category: 'backend' },
  { name: 'Laravel', level: 82, icon: 'Layers', category: 'backend' },
  { name: 'Python', level: 80, icon: 'Code2', category: 'backend' },
  { name: 'REST APIs', level: 95, icon: 'Link', category: 'backend' },
  
  // Database
  { name: 'PostgreSQL', level: 90, icon: 'Database', category: 'database' },
  { name: 'MySQL', level: 88, icon: 'Database', category: 'database' },
  { name: 'MongoDB', level: 85, icon: 'HardDrive', category: 'database' },
  { name: 'Redis', level: 78, icon: 'Zap', category: 'database' },
  
  // Tools & DevOps
  { name: 'Git', level: 95, icon: 'GitBranch', category: 'tools' },
  { name: 'Docker', level: 85, icon: 'Container', category: 'tools' },
  { name: 'AWS', level: 80, icon: 'Cloud', category: 'tools' },
  { name: 'Vercel', level: 90, icon: 'Globe', category: 'tools' },
  { name: 'GitHub Actions', level: 85, icon: 'GitBranch', category: 'tools' },
];

export const projects: Project[] = [
  {
    id: 'saas-platform',
    title: 'Enterprise SaaS Platform',
    description: 'Complete SaaS solution with multi-tenancy, subscription management, and advanced analytics. Built for scalability with microservices architecture.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
    featured: true,
    metrics: [
      { label: 'Active Users', value: '10K+' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Performance Score', value: '95+' }
    ]
  },
  {
    id: 'ecommerce-platform',
    title: 'Full-Stack E-commerce Platform',
    description: 'Modern e-commerce solution with real-time inventory, payment processing, admin dashboard, and mobile-responsive design.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    technologies: ['Next.js', 'Express.js', 'MongoDB', 'Stripe API'],
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'social-media-app',
    title: 'Social Media Application',
    description: 'Real-time social platform with chat, notifications, content management, and advanced user engagement features.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    technologies: ['React', 'Socket.io', 'Node.js', 'Redis'],
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'fintech-dashboard',
    title: 'FinTech Analytics Dashboard',
    description: 'Comprehensive financial dashboard with real-time data visualization, reporting, and secure transaction processing.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    technologies: ['Vue.js', 'Laravel', 'PostgreSQL', 'Chart.js'],
    demoUrl: '#',
    githubUrl: '#'
  }
];

export const experiences: Experience[] = [
  {
    id: 'senior-fullstack',
    title: 'Senior Fullstack Developer',
    company: 'TechFlow Solutions',
    period: '2021 - Present',
    description: 'Leading development of enterprise web applications and SaaS platforms. Architected scalable solutions serving 50,000+ users with 99.9% uptime.',
    technologies: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'TypeScript'],
    achievements: [
      'Increased application performance by 60%',
      'Led team of 8 developers',
      'Implemented microservices architecture'
    ]
  },
  {
    id: 'fullstack-developer',
    title: 'Fullstack Developer',
    company: 'Digital Innovation Labs',
    period: '2019 - 2021',
    description: 'Developed modern web applications using React, Vue.js, and Node.js. Built e-commerce platforms and real-time applications with advanced features.',
    technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Socket.io'],
    achievements: [
      'Delivered 15+ successful projects',
      'Reduced load times by 45%',
      'Implemented real-time features'
    ]
  },
  {
    id: 'web-developer',
    title: 'Web Developer',
    company: 'StartupTech Inc',
    period: '2017 - 2019',
    description: 'Built responsive web applications and REST APIs. Focused on user experience optimization and modern web development practices.',
    technologies: ['JavaScript', 'PHP', 'MySQL', 'Laravel'],
    achievements: [
      'Improved user engagement by 35%',
      'Built 20+ responsive websites',
      'Optimized SEO performance'
    ]
  }
];

export const services: Service[] = [
  {
    id: 'web-app-development',
    title: 'Web Application Development',
    description: 'Custom web applications built with modern technologies for optimal performance and user experience.',
    icon: 'Globe',
    features: ['React/Vue.js Frontend', 'Node.js/Express Backend', 'Database Design', 'API Integration', 'Responsive Design'],
    price: 'Starting at $5,000',
    duration: '4-8 weeks'
  },
  {
    id: 'ecommerce-solutions',
    title: 'E-commerce Solutions',
    description: 'Complete e-commerce platforms with payment processing, inventory management, and admin dashboards.',
    icon: 'ShoppingCart',
    features: ['Payment Integration', 'Inventory Management', 'Admin Dashboard', 'Mobile Responsive', 'SEO Optimization'],
    price: 'Starting at $8,000',
    duration: '6-12 weeks'
  },
  {
    id: 'saas-development',
    title: 'SaaS Platform Development',
    description: 'Scalable SaaS solutions with subscription management, multi-tenancy, and advanced analytics.',
    icon: 'Cloud',
    features: ['Multi-tenant Architecture', 'Subscription Management', 'Analytics Dashboard', 'API Development', 'Cloud Deployment'],
    price: 'Starting at $15,000',
    duration: '12-20 weeks'
  },
  {
    id: 'api-development',
    title: 'API Development & Integration',
    description: 'RESTful APIs and third-party integrations to connect your applications with external services.',
    icon: 'Link',
    features: ['REST API Design', 'Third-party Integrations', 'Documentation', 'Authentication', 'Rate Limiting'],
    price: 'Starting at $3,000',
    duration: '2-4 weeks'
  }
];

export const socialLinks = {
  linkedin: 'https://linkedin.com/in/chidiogara',
  github: 'https://github.com/chidiogara',
  email: 'hello@chidiogara.dev',
  phone: '+1 (555) 123-4567'
};

export const resumeUrl = '#'; // This would be the actual resume download URL
