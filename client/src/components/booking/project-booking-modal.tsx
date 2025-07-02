import { useState } from 'react';
import { Calendar, Clock, DollarSign, Send, CheckCircle, User, Mail, Phone, ArrowRight, ArrowLeft, Briefcase, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BookingForm } from '@/lib/types';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface ProjectBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}

export function ProjectBookingModal({ isOpen, onClose, user }: ProjectBookingModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingForm>({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
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

  const handlePrevStep = () => {
    setCurrentStep(1);
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
        description: "Thank you! I'll get back to you within 24 hours to discuss your project.",
        variant: "default",
      });

      // Reset form and close modal
      setTimeout(() => {
        setFormData({
          name: user ? `${user.firstName} ${user.lastName}` : '',
          email: user?.email || '',
          phone: user?.phone || '',
          service: '',
          projectType: '',
          budget: '',
          timeline: '',
          message: ''
        });
        setCurrentStep(1);
        setSubmissionStatus('');
        onClose();
      }, 2000);

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

  const handleClose = () => {
    setCurrentStep(1);
    setSubmissionStatus('');
    setFormData({
      name: user ? `${user.firstName} ${user.lastName}` : '',
      email: user?.email || '',
      phone: user?.phone || '',
      service: '',
      projectType: '',
      budget: '',
      timeline: '',
      message: ''
    });
    onClose();
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors text-sm ${
          currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
        }`}>
          {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
        </div>
        <div className={`w-12 h-1 rounded-full transition-colors ${
          currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
        }`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors text-sm ${
          currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
        }`}>
          2
        </div>
      </div>
    </div>
  );

  const Step1Form = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Tell me about yourself</h3>
        <p className="text-sm text-gray-600">Let's start with your contact information</p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            Full Name *
            {user && <span className="text-xs text-green-600 ml-auto">✓ From your profile</span>}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your full name"
            className="h-10"
            disabled={!!user}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4" />
            Email Address *
            {user && <span className="text-xs text-green-600 ml-auto">✓ From your profile</span>}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className="h-10"
            disabled={!!user}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" />
            Phone Number *
            {user && formData.phone && <span className="text-xs text-green-600 ml-auto">✓ From your profile</span>}
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            className="h-10"
            disabled={!!user && !!formData.phone}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service" className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4" />
            Service Type *
          </Label>
          <Select value={formData.service} onValueChange={(value) => handleSelectChange('service', value)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web development">Web Development</SelectItem>
              <SelectItem value="mobile app">Mobile Application</SelectItem>
              <SelectItem value="api development">API Development</SelectItem>
              <SelectItem value="database design">Database Design</SelectItem>
              <SelectItem value="system architecture">System Architecture</SelectItem>
              <SelectItem value="consultation">Technical Consultation</SelectItem>
              <SelectItem value="maintenance">Maintenance & Support</SelectItem>
              <SelectItem value="other">Other (Please specify in message)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNextStep} className="bg-blue-600 hover:bg-blue-700">
          Next Step <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const Step2Form = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Project Details</h3>
        <p className="text-sm text-gray-600">Tell me more about your project requirements</p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectType" className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4" />
            Project Type *
          </Label>
          <Select value={formData.projectType} onValueChange={(value) => handleSelectChange('projectType', value)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new project">New Project</SelectItem>
              <SelectItem value="redesign">Website Redesign</SelectItem>
              <SelectItem value="feature addition">Feature Addition</SelectItem>
              <SelectItem value="bug fixes">Bug Fixes & Optimization</SelectItem>
              <SelectItem value="migration">Platform Migration</SelectItem>
              <SelectItem value="integration">Third-party Integration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget" className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4" />
            Budget Range *
          </Label>
          <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select budget range" />
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
          <Label htmlFor="timeline" className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            Timeline *
          </Label>
          <Select value={formData.timeline} onValueChange={(value) => handleSelectChange('timeline', value)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asap">ASAP (Rush job)</SelectItem>
              <SelectItem value="1-month">Within 1 month</SelectItem>
              <SelectItem value="2-3-months">2-3 months</SelectItem>
              <SelectItem value="3-6-months">3-6 months</SelectItem>
              <SelectItem value="6-months-plus">6+ months</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4" />
            Project Description
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell me more about your project, specific requirements, or any questions you have..."
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handlePrevStep}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>Submitting...</>
          ) : (
            <>Submit Request <Send className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="text-center py-8">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted!</h3>
      <p className="text-gray-600 mb-4">
        Thank you for your interest! I'll review your project details and get back to you within 24 hours.
      </p>
      <p className="text-sm text-gray-500">
        This modal will close automatically...
      </p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Book Private Consultation</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {submissionStatus === 'success' ? (
            <SuccessView />
          ) : (
            <>
              <StepIndicator />
              <form onSubmit={handleSubmit}>
                {currentStep === 1 ? <Step1Form /> : <Step2Form />}
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}