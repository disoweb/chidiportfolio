import { Download, Mail, Award, Target, Lightbulb } from 'lucide-react';
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
      className={`py-24 bg-gradient-to-br from-blue-50/30 to-white transition-all duration-1000 ${
        isIntersecting ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-blue-600 font-semibold text-lg mb-4 tracking-wide">ABOUT ME</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Passionate About <span className="gradient-text">Innovation</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Solving complex problems through innovative technology solutions and engineering excellence
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Content */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-50">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">My Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    With over 5 years of experience in software development and engineering, I specialize in creating 
                    scalable solutions that bridge the gap between complex technical requirements and real-world business needs.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-50">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Key Achievement</h3>
                  <p className="text-gray-600 leading-relaxed">
                    My expertise spans across fullstack web development, solar system design, microgrid optimization, 
                    and embedded systems. I'm particularly proud of my work on the 2016 biometric voting machine pilot 
                    project, which demonstrated my ability to deliver innovative solutions under challenging circumstances.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-50">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">My Philosophy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    I believe in the power of technology to transform industries and improve lives. Whether it's 
                    developing robust web applications or designing efficient energy systems, I approach every 
                    project with curiosity, precision, and a commitment to excellence.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Resume Download & Contact */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
              >
                <Download className="w-5 h-5 mr-3" />
                Download Resume
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('#contact')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
              >
                <Mail className="w-5 h-5 mr-3" />
                Get In Touch
              </Button>
            </div>
          </div>
          
          {/* Visual Content */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Excellence</h4>
                  <p className="text-gray-600 text-sm">Delivering top-quality solutions with attention to detail</p>
                </div>
                
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Innovation</h4>
                  <p className="text-gray-600 text-sm">Embracing cutting-edge technologies and creative solutions</p>
                </div>
              </div>
              
              <div className="space-y-6 mt-12">
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Collaboration</h4>
                  <p className="text-gray-600 text-sm">Working effectively with diverse teams and stakeholders</p>
                </div>
                
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Problem Solving</h4>
                  <p className="text-gray-600 text-sm">Analytical thinking and creative approaches to challenges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
