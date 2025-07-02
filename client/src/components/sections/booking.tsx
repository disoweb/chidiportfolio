import { useState } from 'react';
import { Calendar, Clock, DollarSign, Send, CheckCircle, User, Mail, Phone, ArrowRight, ArrowLeft, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { BookingForm } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';

export function Booking() {
  const { elementRef, isIntersecting } = useIntersectionObserver();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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

  const [submissionStatus, setSubmissionStatus] = useState<'' | 'success' | 'error'>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const reset = () => {
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
    setCurrentStep(1);
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.service) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, and Service).",
        variant: "destructive",
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmissionStatus(''); // Reset status before submitting

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Booking submission successful:', result);

      if (result.success) {
        toast({
          title: "Booking Submitted Successfully!",
          description: "We'll get back to you within 24 hours. Check your project dashboard for updates.",
        });
        setSubmissionStatus('success');

        // Redirect to client dashboard after successful booking
        setTimeout(() => {
          window.location.href = `/client/dashboard?email=${encodeURIComponent(formData.email)}`;
        }, 2000);

        reset();
      } else {
        console.error('Booking submission failed:', result);
        toast({
          title: "Submission Failed",
          description: result.error || "Please try again later.",
          variant: "destructive",
        });
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6 sm:mb-8">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 ${
          currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-300'
        }`}>
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className={`h-1 w-12 sm:w-16 transition-all duration-300 ${
          currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
        }`}></div>
        <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 ${
          currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-300'
        }`}>
          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );

  const Step1Form = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Let's Get Started</h3>
        <p className="text-gray-600">Tell us about yourself and what service you need</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
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
              autoComplete="name"
              autoCorrect="off"
              autoCapitalize="words"
              className="pl-10 py-3 text-base sm:text-sm min-h-[48px] rounded-xl"
              placeholder="John Doe"
              style={{ fontSize: '16px' }}
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
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="none"
              className="pl-10 py-3 text-base sm:text-sm min-h-[48px] rounded-xl"
              placeholder="john@example.com"
              style={{ fontSize: '16px' }}
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
            autoComplete="tel"
            autoCorrect="off"
            autoCapitalize="none"
            className="pl-10 py-3 text-base sm:text-sm min-h-[48px] rounded-xl"
            placeholder="+1 (555) 123-4567"
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="service" className="block text-sm font-medium mb-2">
          Service Type *
        </Label>
        <Select onValueChange={(value) => handleSelectChange('service', value)} value={formData.service}>
          <SelectTrigger className="py-3 text-base sm:text-sm min-h-[48px] rounded-xl">
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

      <Button 
        type="button"
        onClick={handleNextStep}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] min-h-[56px] touch-manipulation"
      >
        <span className="flex items-center justify-center">
          Continue to Project Details
          <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
        </span>
      </Button>
    </div>
  );

  const Step2Form = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Project Details</h3>
        <p className="text-gray-600">Help us understand your project requirements</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <Label htmlFor="projectType" className="block text-sm font-medium mb-2">
            Project Category *
          </Label>
          <Select onValueChange={(value) => handleSelectChange('projectType', value)} value={formData.projectType}>
            <SelectTrigger className="py-3 text-base sm:text-sm min-h-[48px] rounded-xl">
              <SelectValue placeholder="Select project category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New Project</SelectItem>
              <SelectItem value="redesign">Website Redesign</SelectItem>
              <SelectItem value="maintenance">Maintenance & Updates</SelectItem>
              <SelectItem value="optimization">Performance Optimization</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="budget" className="block text-sm font-medium mb-2">
            Budget Range
          </Label>
          <Select onValueChange={(value) => handleSelectChange('budget', value)} value={formData.budget}>
            <SelectTrigger className="py-3 text-base sm:text-sm min-h-[48px] rounded-xl">
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-5k">Under ₦150,000</SelectItem>
              <SelectItem value="5k-10k">₦150,000 - ₦600,000</SelectItem>
              <SelectItem value="10k-25k">₦600,000 - ₦1,500,000</SelectItem>
              <SelectItem value="25k-plus">₦1,500,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="timeline" className="block text-sm font-medium mb-2">
          Timeline
        </Label>
        <Select onValueChange={(value) => handleSelectChange('timeline', value)} value={formData.timeline}>
          <SelectTrigger className="py-3 text-base sm:text-sm min-h-[48px] rounded-xl">
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

      <div>
        <Label htmlFor="message" className="block text-sm font-medium mb-2">
          Project Details
        </Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none z-10" />
          <Textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full resize-none pl-10 pt-3 pb-3 pr-3 text-base sm:text-sm min-h-[96px] max-h-[200px] rounded-xl"
            placeholder="Tell me about your project goals, requirements, and any specific features you need..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
            spellCheck="true"
            style={{
              fontSize: '16px', // Always use 16px to prevent zoom on mobile
              WebkitAppearance: 'none',
              appearance: 'none'
            }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button 
          type="button"
          onClick={handlePrevStep}
          variant="outline"
          className="flex-1 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-h-[56px] touch-manipulation order-2 sm:order-1"
        >
          <span className="flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 mr-2 flex-shrink-0" />
            Back
          </span>
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] min-h-[56px] touch-manipulation order-1 sm:order-2"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Submitting...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Send className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="hidden xs:inline">Schedule Consultation</span>
              <span className="xs:hidden">Schedule</span>
            </span>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <section 
      ref={elementRef}
      id="booking" 
      className={`py-10 bg-gradient-to-br from-blue-50/30 to-white transition-all duration-1000 ${
        isIntersecting ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-blue-600 font-semibold text-lg mb-4 tracking-wide">BOOK CONSULTATION</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Let's Build Something <span className="gradient-text">Amazing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Schedule a free consultation
          </p>
        </div>

        {/* Mobile Form - Shows immediately after heading */}
        <div className="lg:hidden mb-12">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-50">
            <StepIndicator />
            <form onSubmit={handleSubmit}>
              {currentStep === 1 ? <Step1Form /> : <Step2Form />}
            </form>

            {/* Success/Error Messages - Mobile */}
            {submissionStatus === 'success' && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <div>
                    <p className="font-semibold">Booking Request Submitted Successfully!</p>
                    <p>We'll get back to you within 24 hours to schedule our consultation.</p>
                  </div>
                </div>
                <div className="mt-3">
                  <a 
                    href={`/client/dashboard?email=${encodeURIComponent(formData.email)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    Access Your Project Dashboard
                  </a>
                </div>
              </div>
            )}

            {submissionStatus === 'error' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">Submission Failed</p>
                    <p>Please check your connection and try again. If the problem persists, contact us directly.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Benefits - Shows on all screens */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What You Get</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Free Consultation</h4>
                    <p className="text-gray-600">Discuss your project goals and technical requirements</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Project Roadmap</h4>
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
              <p className="opacity-90">I'll respond to your consultation request within minutes and we can schedule a free call ASAP.</p>
            </div>
          </div>

          {/* Desktop Form - Hidden on mobile, shown on large screens */}
          <div className="hidden lg:block bg-white rounded-3xl p-8 shadow-xl border border-blue-50 order-1 lg:order-2">
            <StepIndicator />
            <form onSubmit={handleSubmit}>
              {currentStep === 1 ? <Step1Form /> : <Step2Form />}
            </form>

            {/* Success/Error Messages - Desktop */}
            {submissionStatus === 'success' && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <div>
                    <p className="font-semibold">Booking Request Submitted Successfully!</p>
                    <p>We'll get back to you within 24 hours to schedule our consultation.</p>
                  </div>
                </div>
                <div className="mt-3">
                  <a 
                    href={`/client/dashboard?email=${encodeURIComponent(formData.email)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    Access Your Project Dashboard
                  </a>
                </div>
              </div>
            )}

            {submissionStatus === 'error' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">Submission Failed</p>
                    <p>Please check your connection and try again. If the problem persists, contact us directly.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}