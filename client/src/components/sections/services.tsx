import { Globe, ShoppingCart, Cloud, Link, Calendar, CheckCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { services } from '@/lib/constants';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

import { EmailModal } from '@/components/checkout/EmailModal';

const iconMap: { [key: string]: any } = {
  Globe,
  ShoppingCart,
  Cloud,
  Link,
};

export function Services() {
  const { elementRef, isIntersecting } = useIntersectionObserver();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    id: string;
    title: string;
    price: number;
  } | null>(null);
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPriceValue = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  };

  
  const initiatePayment = async (userEmail: string) => {
    if (!selectedService) return;
    console.log('Initiating payment for:', selectedService.title, 'with email:', userEmail, 'and amount:', selectedService.price);
    
    try {
      const response = await fetch('/api/paystack/initiate', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          amount: selectedService.price,
          serviceId: selectedService.id,
          serviceName: selectedService.title,
          
        })
      });

      const data = await response.json();

      if (data.success && data.data.authorizationUrl) {
        window.location.href = data.data.authorizationUrl;
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      
      setShowEmailModal(false); 
    }
  };


  const handlePaymentSuccess = (reference: string, serviceName: string) => {
    toast({
      title: "Payment Successful",
      description: `Your payment for ${serviceName} has been completed.`,
      variant: "success", 
    });
    router.push(`/payment/success?reference=${reference}`);
  };

  const handlePaymentClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "You can complete your payment later.",
      variant: "default", 
    });
  };

  const handlePayNowClick = (service: { id: string; title: string; price: string }) => {
    const priceValue = getPriceValue(service.price);
    if (priceValue <= 0) {
      scrollToSection('#booking'); // Assuming #booking is your booking/contact form
      return;
    }
    setSelectedService({
      id: service.id,
      title: service.title,
      price: priceValue
    });
    setShowEmailModal(true);
  };

  return (
    <section
      ref={elementRef}
      id="services"
      className={`py-5 bg-white transition-all duration-1000 ${
        isIntersecting ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="text-blue-600 font-semibold text-lg mb-4 tracking-wide"></p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            What I Can <span className="gradient-text">Build For You</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From simple websites to complex SaaS platforms, I deliver high-quality web solutions tailored to your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 md:mb-16">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Globe;
            const priceValue = getPriceValue(service.price);

            return (
              <div key={service.id} className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 w-full max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                  <div className="bg-blue-600 p-3 sm:p-4 rounded-2xl flex-shrink-0">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">{service.title}</h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{service.description}</p>

                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm sm:text-base break-words">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-4 sm:mb-6">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          {service.price.startsWith('₦') ? service.price : `₦${service.price}`}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">{service.duration}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => scrollToSection('#booking')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Now
                        </Button>
                        {priceValue > 0 && (
                          <Button
                            onClick={() => handlePayNowClick({
                              id: service.id,
                              title: service.title,
                              price: service.price
                            })}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

       
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 sm:p-8 lg:p-12 text-white mx-4 sm:mx-0">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Start Your Project?</h3>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
            Let's discuss your requirements and create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('#booking')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Schedule Free Consultation
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection('#contact')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300"
            >
              Get Quote
            </Button>
          </div>
        </div>
      </div>

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        
        onEmailSubmit={async (userEmail) => {
          setEmail(userEmail); 
          
          if (selectedService) { 
            await initiatePayment(userEmail); 
          } else {
            
            toast({ title: "Error", description: "No service selected.", variant: "destructive" });
            setShowEmailModal(false);
          }
        }}
      />
    </section>
  );
}