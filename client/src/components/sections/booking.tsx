import { useState } from 'react';
import { Calendar, Clock, DollarSign, Send, CheckCircle, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { BookingForm } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';

export function Booking() {
  const { elementRef, isIntersecting } = useIntersectionObserver();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    service: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service || !formData.projectType) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/booking', formData);
      
      toast({
        title: "Booking submitted successfully!",
        description: "I'll contact you within 24 hours to schedule your consultation.",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or email me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={elementRef}
      id="booking" 
      className={`py-10 bg-gradient-to-br from-blue-50/30 to-white transition-all duration-1000 ${
        isIntersecting ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-blue-600 font-semibold text-lg mb-4 tracking-wide">BOOK CONSULTATION</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Let's Build Something <span className="gradient-text">Amazing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Schedule a free consultation to discuss your project requirements and get a custom quote
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Benefits */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What You Get</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Free 30-minute Consultation</h4>
                    <p className="text-gray-600">Discuss your project goals and technical requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Project Timeline & Roadmap</h4>
                    <p className="text-gray-600">Detailed timeline with milestones and deliverables</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Custom Quote</h4>
                    <p className="text-gray-600">Transparent pricing based on your specific needs</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h4>
                    <p className="text-gray-600">Available for meetings in your timezone</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Fast Response Guarantee</h3>
              <p className="opacity-90">I'll respond to your consultation request within 24 hours and we can schedule a call within 2-3 business days.</p>
            </div>
          </div>
          
          {/* Booking Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="service" className="block text-sm font-medium mb-2">
                    Service Type *
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('service', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-app">Web Application</SelectItem>
                      <SelectItem value="ecommerce">E-commerce Platform</SelectItem>
                      <SelectItem value="saas">SaaS Platform</SelectItem>
                      <SelectItem value="api">API Development</SelectItem>
                      <SelectItem value="consultation">Consultation Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="projectType" className="block text-sm font-medium mb-2">
                    Project Type *
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('projectType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Project</SelectItem>
                      <SelectItem value="redesign">Website Redesign</SelectItem>
                      <SelectItem value="maintenance">Maintenance & Updates</SelectItem>
                      <SelectItem value="optimization">Performance Optimization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="budget" className="block text-sm font-medium mb-2">
                    Budget Range
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('budget', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5k">Under $5,000</SelectItem>
                      <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-plus">$25,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeline" className="block text-sm font-medium mb-2">
                    Timeline
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('timeline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="1-month">Within 1 month</SelectItem>
                      <SelectItem value="2-3-months">2-3 months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="message" className="block text-sm font-medium mb-2">
                  Project Details
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="resize-vertical"
                  placeholder="Tell me about your project goals, requirements, and any specific features you need..."
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Schedule Free Consultation
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}