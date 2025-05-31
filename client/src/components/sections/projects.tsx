import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { projects } from '@/lib/constants';

export function Projects() {
  const { elementRef, isIntersecting } = useIntersectionObserver();

  const featuredProject = projects.find(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section 
      ref={elementRef}
      id="projects" 
      className={`py-20 bg-white dark:bg-slate-800 transition-all duration-1000 ${
        isIntersecting ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Innovative solutions that demonstrate technical expertise and real-world impact
          </p>
        </div>
        
        {/* Featured Project - Biometric Voting System */}
        {featuredProject && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <Badge className="bg-blue-600 text-white mr-3">Featured</Badge>
                    <Badge variant="secondary" className="text-orange-600 dark:text-orange-400">2016 Pilot Project</Badge>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    {featuredProject.title}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {featuredProject.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredProject.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="border-blue-200 text-blue-800 dark:text-blue-200">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Key Metrics */}
                  {featuredProject.metrics && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {featuredProject.metrics.map((metric) => (
                        <div key={metric.label} className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {metric.value}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      View Case Study
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                      Technical Details
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <img 
                    src={featuredProject.image}
                    alt="Biometric voting technology with fingerprint scanner" 
                    className="rounded-xl shadow-2xl w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherProjects.map((project) => (
            <div key={project.id} className="project-card bg-white dark:bg-slate-700 rounded-xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-600 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors duration-200" />
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">
                    View Project
                  </Button>
                  {project.githubUrl && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Github className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Projects */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
