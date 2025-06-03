import { Skill, Project, Experience, Service } from "./types";

export const skills: Skill[] = [
  // Frontend
  { name: "React", level: 95, icon: "React", category: "frontend" },
  { name: "TypeScript", level: 90, icon: "TypeScript", category: "frontend" },
  { name: "Next.js", level: 88, icon: "NextJs", category: "frontend" },
  { name: "JavaScript", level: 95, icon: "JavaScript", category: "frontend" },
  { name: "HTML/CSS", level: 98, icon: "Html5", category: "frontend" },
  {
    name: "Tailwind CSS",
    level: 92,
    icon: "TailwindCss",
    category: "frontend",
  },

  // Backend
  { name: "Node.js", level: 90, icon: "NodeJs", category: "backend" },
  { name: "PHP", level: 88, icon: "Php", category: "backend" },
  { name: "Laravel", level: 85, icon: "Laravel", category: "backend" },
  { name: "Express.js", level: 88, icon: "Express", category: "backend" },
  { name: "Python", level: 75, icon: "Python", category: "backend" },

  // Database
  { name: "PostgreSQL", level: 85, icon: "PostgreSql", category: "database" },
  { name: "MySQL", level: 90, icon: "MySql", category: "database" },
  { name: "MongoDB", level: 80, icon: "MongoDb", category: "database" },
  { name: "Redis", level: 75, icon: "Redis", category: "database" },

  // Tools
  { name: "Git", level: 95, icon: "Git", category: "tools" },
  { name: "Docker", level: 80, icon: "Docker", category: "tools" },
  { name: "AWS", level: 78, icon: "Aws", category: "tools" },
  { name: "Vercel", level: 90, icon: "Vercel", category: "tools" },
];

export const services: Service[] = [
  {
    id: "custom-web-apps",
    title: "Custom Web Applications",
    description:
      "Full-stack web applications built with modern tech. Perfect for businesses needing custom solutions.",
    icon: "Globe",
    features: [
      "React/Next.js Frontend Development",
      "Node.js/PHP Backend APIs",
      "Database Design & Integration",
      "Authentication & Security",
      "Responsive Design",
      "Performance Optimization",
    ],
    price: "Starting at ₦250,000",
    duration: "1-4 weeks",
  },
  {
    id: "ecommerce-platforms",
    title: "E-commerce Platforms",
    description:
      "Complete e-commerce solutions with payment processing, inventory management, and admin dashboards built for scalability.",
    icon: "ShoppingCart",
    features: [
      "Product Catalog Management",
      "Shopping Cart & Checkout",
      "Payment Gateway Integration",
      "Order Management System",
      "Admin Dashboard",
      "Mobile-Responsive Design",
    ],
    price: "Starting at ₦250,000",
    duration: "1-4 weeks",
  },
  {
    id: "saas-platforms",
    title: "SaaS Platforms",
    description:
      "Software-as-a-Service platforms with subscription management, multi-tenancy, and scalable architecture.",
    icon: "Cloud",
    features: [
      "Multi-tenant Architecture",
      "Subscription Management",
      "User Authentication & Roles",
      "Analytics Dashboard",
      "API Development",
      "Third-party Integrations",
    ],
    price: "Starting at ₦350,000",
    duration: "2-4 weeks",
  },
  {
    id: "api-development",
    title: "API Development & Integration",
    description:
      "RESTful APIs and microservices with comprehensive documentation, authentication, and third-party integrations.",
    icon: "Link",
    features: [
      "RESTful API Design",
      "API Documentation",
      "Authentication & Authorization",
      "Third-party Integrations",
      "Database Optimization",
      "API Testing & Monitoring",
    ],
    price: "Starting at ₦200,000",
    duration: "1-2 weeks",
  },
];

export const projects: Project[] = [
  {
    id: "biometric-voting",
    title: "Automated Biometric Voting Machine",
    description:
      "Revolutionary voting system integrating biometric authentication with secure data management. Successfully piloted in 2016 with 99.8% accuracy rate.",
    image:
      "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "Embedded Systems",
      "Biometric APIs",
      "Secure Database",
      "Real-time Processing",
    ],
    featured: true,
    metrics: [
      { label: "Accuracy", value: "99.8%" },
      { label: "Security", value: "99.92%" },
      { label: "Fraud Protection", value: "89.23%" },
    ],
  },
  {
    id: "ecommerce-platform",
    title: "Multi-vendor E-commerce Platform",
    description:
      "Comprehensive e-commerce solution supporting multiple vendors, real-time inventory, and integrated payment processing.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    demoUrl: "#",
    githubUrl: "#",
    metrics: [
      { label: "Vendors Supported", value: "50+" },
      { label: "Monthly Transactions", value: "$100K+" },
      { label: "Page Load Time", value: "<2s" },
    ],
  },
  {
    id: "saas-dashboard",
    title: "Analytics SaaS Platform",
    description:
      "Real-time analytics platform with customizable dashboards, automated reporting, and multi-tenant architecture.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Chart.js", "Vercel"],
    demoUrl: "#",
    githubUrl: "#",
    metrics: [
      { label: "Active Users", value: "2,500+" },
      { label: "Data Points/Day", value: "1M+" },
      { label: "Uptime", value: "99.9%" },
    ],
  },
  {
    id: "fintech-api",
    title: "Financial Services API",
    description:
      "Secure API platform for financial transactions with real-time fraud detection and compliance monitoring.",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["Node.js", "Express", "PostgreSQL", "JWT", "Docker"],
    githubUrl: "#",
    metrics: [
      { label: "Transactions/Day", value: "50K+" },
      { label: "Response Time", value: "<100ms" },
      { label: "Security Score", value: "A+" },
    ],
  },
];

export const experiences: Experience[] = [
  {
    id: "senior-fullstack-current",
    title: "Fullstack Developer",
    company: "Freelance / Contract",
    period: "2019 - Present",
    description:
      "Leading full-stack development projects for diverse clients, specializing in modern web technologies and scalable architectures.",
    technologies: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "AWS",
      "PostgreSQL",
    ],
    achievements: [
      "Delivered 30+ successful web applications",
      "Increased client revenue by 40% on average through optimized solutions",
      "Maintained 98% client satisfaction rate",
      "Reduced application load times by 60% through performance optimization",
    ],
  },
  {
    id: "fullstack-developer",
    title: "Fullstack Web Developer",
    company: "Tech Solutions Inc.",
    period: "2018 - 2020",
    description:
      "Developed and maintained web applications using modern JavaScript frameworks and backend technologies.",
    technologies: ["React", "PHP", "Laravel", "MySQL", "JavaScript"],
    achievements: [
      "Built 15+ production web applications",
      "Improved team productivity by 54% through code standardization",
      "Mentored 3 junior developers",
      "Implemented CI/CD pipelines reducing deployment time by 50%",
    ],
  },
  {
    id: "junior-developer",
    title: "Junior Web Developer",
    company: "Digital Agency Pro",
    period: "2017 - 2018",
    description:
      "Started career developing websites and learning modern web development practices.",
    technologies: ["HTML/CSS", "JavaScript", "PHP", "WordPress", "jQuery"],
    achievements: [
      "Completed 20+ website projects",
      "Achieved 95% client approval rating",
      "Learned and implemented responsive design principles",
      "Contributed to team workflow improvements",
    ],
  },
];
