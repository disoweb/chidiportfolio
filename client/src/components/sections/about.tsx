import { Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

export function About() {
  const { elementRef, isIntersecting } = useIntersectionObserver();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={elementRef}
      id="about" 
      className={`py-20 bg-white dark:bg-slate-800 transition-all duration-1000 ${
        isIntersecting ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Passionate about solving complex problems through innovative technology solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              With over 5 years of experience in software development and engineering, I specialize in creating 
              scalable solutions that bridge the gap between complex technical requirements and real-world business needs.
            </p>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              My expertise spans across fullstack web development, solar system design, microgrid optimization, 
              and embedded systems. I'm particularly proud of my work on the 2016 biometric voting machine pilot 
              project, which demonstrated my ability to deliver innovative solutions under challenging circumstances.
            </p>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              I believe in the power of technology to transform industries and improve lives. Whether it's 
              developing robust web applications or designing efficient energy systems, I approach every 
              project with curiosity, precision, and a commitment to excellence.
            </p>
            
            {/* Resume Download & Contact */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('#contact')}
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                <Mail className="w-4 h-4 mr-2" />
                Get In Touch
              </Button>
            </div>
          </div>
          
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
              alt="Modern software development workspace" 
              className="rounded-lg shadow-lg w-full h-48 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
              alt="Solar panel systems on rooftop" 
              className="rounded-lg shadow-lg w-full h-48 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
              alt="Embedded systems circuit board technology" 
              className="rounded-lg shadow-lg w-full h-48 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
              alt="Professional team collaboration and development" 
              className="rounded-lg shadow-lg w-full h-48 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
