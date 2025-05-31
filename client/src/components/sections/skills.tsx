import { 
  Code, 
  Database, 
  Server, 
  Sun, 
  Zap, 
  Cpu, 
  GitBranch, 
  Cloud,
  Container
} from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

const skillCategories = [
  {
    title: 'Software Development',
    icon: Code,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    skills: [
      { name: 'React', level: 90, icon: 'fab fa-react' },
      { name: 'JavaScript', level: 95, icon: 'fab fa-js-square' },
      { name: 'PHP', level: 85, icon: 'fab fa-php' },
      { name: 'Laravel', level: 80, icon: 'fab fa-laravel' },
      { name: 'Node.js', level: 85, icon: 'fab fa-node-js' },
      { name: 'MySQL', level: 88, icon: 'fas fa-database' },
    ]
  },
  {
    title: 'Engineering',
    icon: Sun,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    skills: [
      { name: 'Solar System Design', level: 92, description: 'Photovoltaic system design, load analysis, and energy optimization' },
      { name: 'Microgrid Systems', level: 85, description: 'Grid integration, energy storage, and smart grid technologies' },
      { name: 'Embedded Systems', level: 88, description: 'Microcontroller programming, IoT integration, and hardware interfacing' },
    ]
  },
  {
    title: 'Tools & Workflow',
    icon: GitBranch,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900',
    skills: [
      { name: 'Git', level: 92 },
      { name: 'Docker', level: 78 },
      { name: 'AWS', level: 80 },
      { name: 'CI/CD', level: 85 },
      { name: 'Linux', level: 88 },
      { name: 'Analytics', level: 75 },
    ]
  }
];

const iconMap: { [key: string]: any } = {
  Git: GitBranch,
  Docker: Container,
  AWS: Cloud,
  'CI/CD': Zap,
  Linux: Server,
  Analytics: Database,
};

export function Skills() {
  const { elementRef, isIntersecting } = useIntersectionObserver();

  return (
    <section 
      ref={elementRef}
      id="skills" 
      className={`py-10 bg-slate-50 dark:bg-slate-900 transition-all duration-1000 ${
        isIntersecting ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            A comprehensive toolkit for building innovative solutions across multiple domains
          </p>
        </div>
        
        {/* Skills Categories */}
        <div className="space-y-12">
          {skillCategories.map((category, categoryIndex) => (
            <div key={category.title}>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center flex items-center justify-center gap-3">
                <category.icon className={`w-8 h-8 ${category.color}`} />
                {category.title}
              </h3>
              
              {category.title === 'Software Development' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="skill-card bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-center">
                        <i className={`${skill.icon} text-3xl ${category.color} mb-2`} />
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{skill.name}</h4>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: isIntersecting ? `${skill.level}%` : '0%' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {category.title === 'Engineering' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="skill-card bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-center">
                        {skill.name === 'Solar System Design' && <Sun className={`w-10 h-10 ${category.color} mx-auto mb-4`} />}
                        {skill.name === 'Microgrid Systems' && <Zap className={`w-10 h-10 ${category.color} mx-auto mb-4`} />}
                        {skill.name === 'Embedded Systems' && <Cpu className={`w-10 h-10 ${category.color} mx-auto mb-4`} />}
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{skill.name}</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{skill.description}</p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: isIntersecting ? `${skill.level}%` : '0%' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {category.title === 'Tools & Workflow' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {category.skills.map((skill) => {
                    const IconComponent = iconMap[skill.name] || GitBranch;
                    return (
                      <div key={skill.name} className="skill-card bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 text-center">
                        <IconComponent className={`w-8 h-8 ${category.color} mx-auto mb-2`} />
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{skill.name}</h4>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: isIntersecting ? `${skill.level}%` : '0%' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
