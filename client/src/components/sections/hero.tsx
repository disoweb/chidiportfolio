import { ArrowRight, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Chidi <span className="text-blue-600">Ogara</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Senior Fullstack Web Developer crafting high-performance web applications 
            that drive business growth and user engagement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection('booking')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => scrollToSection('services')}
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
            >
              View Services
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
            <h3 className="text-3xl font-bold text-blue-600 mb-2">7+</h3>
            <p className="text-gray-600">Years Experience</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
            <h3 className="text-3xl font-bold text-blue-600 mb-2">100+</h3>
            <p className="text-gray-600">Projects Completed</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
            <h3 className="text-3xl font-bold text-blue-600 mb-2">98%</h3>
            <p className="text-gray-600">Client Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
}