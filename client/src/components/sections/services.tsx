import { Globe, ShoppingCart, Cloud, Link, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { services } from '@/lib/constants';

const iconMap: { [key: string]: any } = {
  Globe,
  ShoppingCart,
  Cloud,
  Link,
};

export function Services() {
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
      id="services" 
      className={`py-24 bg-white transition-all duration-1000 ${
        isIntersecting ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-blue-600 font-semibold text-lg mb-4 tracking-wide">SERVICES</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            What I Can <span className="gradient-text">Build For You</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From simple websites to complex SaaS platforms, I deliver high-quality web solutions tailored to your business needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Globe;
            return (
              <div key={service.id} className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start space-x-6">
                  <div className="bg-blue-600 p-4 rounded-2xl">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                        <div className="text-sm text-gray-500">{service.duration}</div>
                      </div>
                      <Button 
                        onClick={() => scrollToSection('#booking')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h3>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your requirements and create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection('#booking')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Schedule Free Consultation
            </Button>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('#contact')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
            >
              Get Quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}