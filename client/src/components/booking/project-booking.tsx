import { useState } from 'react';
import { Calendar, Clock, DollarSign, Send, CheckCircle, User, Mail, Phone, ArrowRight, ArrowLeft, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BookingForm } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';

interface ProjectBookingProps {
  userEmail?: string;
}

export function ProjectBooking({ userEmail }: ProjectBookingProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingForm>({
    name: '',
    email: userEmail || '',
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

  const validateStep1 = () => {
    return formData.name && formData.email && formData.phone && formData.service;
  };

  const validateStep2 = () => {
    return formData.projectType && formData.budget && formData.timeline;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required project details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit project request');
      }

      setSubmissionStatus('success');
      toast({
        title: "Project Request Submitted!",
        description: "Thank you for your interest! I'll get back to you within 24 hours to discuss your project.",
        variant: "default",
      });

      // Reset form
      setFormData({
        name: '',
        email: userEmail || '',
        phone: '',
        service: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: ''
      });
      setCurrentStep(1);
    } catch (error) {
      setSubmissionStatus('error');
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
          currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
        }`}>
          {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
        </div>
        <div className={`w-16 h-1 rounded-full transition-colors ${
          currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
        }`} />
        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
          currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
        }`}>
          2
        </div>
      </div>
    </div>
  );

  const Step1Form = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Tell me about yourself</h3>
        <p className="text-gray-600">Let's start with your contact information</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            required
            disabled={!!userEmail}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Phone Number *
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+1 (555) 123-4567"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service" className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Service Needed *
        </Label>
        <Select onValueChange={(value) => handleSelectChange('service', value)} value={formData.service}>
          <SelectTrigger>
            <SelectValue placeholder="Select the service you need" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web-development">Web Development</SelectItem>
            <SelectItem value="mobile-development">Mobile App Development</SelectItem>
            <SelectItem value="full-stack-development">Full-Stack Development</SelectItem>
            <SelectItem value="api-development">API Development</SelectItem>
            <SelectItem value="database-design">Database Design</SelectItem>
            <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
            <SelectItem value="consulting">Technical Consulting</SelectItem>
            <SelectItem value="maintenance">Website Maintenance</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNextStep} className="bg-blue-600 hover:bg-blue-700">
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const Step2Form = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Details</h3>
        <p className="text-gray-600">Help me understand your project requirements</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectType">Project Type *</Label>
        <Select onValueChange={(value) => handleSelectChange('projectType', value)} value={formData.projectType}>
          <SelectTrigger>
            <SelectValue placeholder="What type of project is this?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new-website">New Website</SelectItem>
            <SelectItem value="website-redesign">Website Redesign</SelectItem>
            <SelectItem value="web-application">Web Application</SelectItem>
            <SelectItem value="mobile-app">Mobile Application</SelectItem>
            <SelectItem value="e-commerce">E-commerce Store</SelectItem>
            <SelectItem value="portfolio">Portfolio Website</SelectItem>
            <SelectItem value="business-website">Business Website</SelectItem>
            <SelectItem value="landing-page">Landing Page</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="budget" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Budget Range *
          </Label>
          <Select onValueChange={(value) => handleSelectChange('budget', value)} value={formData.budget}>
            <SelectTrigger>
              <SelectValue placeholder="Select your budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-5k">Under $5,000</SelectItem>
              <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
              <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
              <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
              <SelectItem value="50k-plus">$50,000+</SelectItem>
              <SelectItem value="discuss">Let's Discuss</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Timeline *
          </Label>
          <Select onValueChange={(value) => handleSelectChange('timeline', value)} value={formData.timeline}>
            <SelectTrigger>
              <SelectValue placeholder="When do you need this?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asap">ASAP (Rush Job)</SelectItem>
              <SelectItem value="1-month">Within 1 Month</SelectItem>
              <SelectItem value="2-3-months">2-3 Months</SelectItem>
              <SelectItem value="3-6-months">3-6 Months</SelectItem>
              <SelectItem value="flexible">Flexible Timeline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Project Description
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell me more about your project... What are your goals? Any specific features or requirements?"
          className="min-h-[120px]"
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              Submit Project Request
              <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  if (submissionStatus === 'success') {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for your project request. I'll review the details and get back to you within 24 hours to discuss next steps.
          </p>
          <Button onClick={() => setSubmissionStatus('')} className="bg-blue-600 hover:bg-blue-700">
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Start a New Project</h2>
        <p className="text-xl text-gray-600">
          Ready to bring your ideas to life? Let's discuss your project requirements.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-8">
          <StepIndicator />
          <form onSubmit={handleSubmit}>
            {currentStep === 1 ? <Step1Form /> : <Step2Form />}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}