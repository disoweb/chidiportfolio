import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { experiences } from '@/lib/constants';

export function Experience() {
  const { elementRef, isIntersecting } = useIntersectionObserver();

  return (
    <section 
      ref={elementRef}
      id="experience" 
      className={`py-20 bg-slate-50 dark:bg-slate-900 transition-all duration-1000 ${
        isIntersecting ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Professional Experience
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            A journey of continuous learning and impactful contributions across diverse projects
          </p>
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-200 to-orange-200 dark:from-blue-800 dark:to-orange-800" />
          
          {experiences.map((experience, index) => (
            <div key={experience.id} className="relative flex items-center justify-between mb-12">
              {/* Left side content for odd items, right for even */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'order-2 pl-8'}`}>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <div className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                      {experience.period}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {experience.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">
                      {experience.company}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {experience.description}
                  </p>
                  <div className={`flex flex-wrap gap-1 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    {experience.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Timeline Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full border-4 border-white dark:border-slate-900 z-10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              
              {/* Empty space for alternating layout */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'order-2' : ''}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
