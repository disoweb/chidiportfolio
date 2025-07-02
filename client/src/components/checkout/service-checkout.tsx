import { useState } from 'react';
import { ShoppingCart, CreditCard, Check, X, ArrowRight, ArrowLeft, Star, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { services } from '@/lib/constants';

interface ServiceCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

interface SelectedService {
  id: string;
  title: string;
  price: number;
  description: string;
  duration: string;
  features: string[];
}

export function ServiceCheckout({ isOpen, onClose, userEmail }: ServiceCheckoutProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: userEmail || '',
    phone: '',
    company: '',
    notes: ''
  });

  const handleServiceSelect = (service: any) => {
    const priceNumber = typeof service.price === 'string' 
      ? parseInt(service.price.replace(/[^0-9]/g, '')) 
      : service.price;

    setSelectedService({
      id: service.title.toLowerCase().replace(/\s+/g, '-'),
      title: service.title,
      price: priceNumber,
      description: service.description,
      duration: service.duration || '2-4 weeks',
      features: service.features || []
    });
    setCurrentStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateCustomerInfo = () => {
    return customerInfo.name && customerInfo.email && customerInfo.phone;
  };

  const handleProceedToPayment = () => {
    if (!validateCustomerInfo()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(3);
  };

  const handlePayment = async () => {
    if (!selectedService) return;

    setIsProcessing(true);

    try {
      // Create booking first
      const bookingData = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        service: selectedService.title,
        projectType: 'Service Order',
        budget: `$${selectedService.price}`,
        timeline: selectedService.duration,
        message: customerInfo.notes || `Service order: ${selectedService.title}`,
        company: customerInfo.company
      };

      const bookingResponse = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await bookingResponse.json();

      // Initialize Paystack payment
      const paymentData = {
        email: customerInfo.email,
        amount: selectedService.price * 100, // Convert to kobo
        bookingId: booking.id,
        metadata: {
          service: selectedService.title,
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          company: customerInfo.company || 'Individual'
        }
      };

      const paymentResponse = await fetch('/api/paystack/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to initialize payment');
      }

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success && paymentResult.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = paymentResult.authorizationUrl;
      } else {
        throw new Error('Payment initialization failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedService(null);
    setCustomerInfo({
      name: '',
      email: userEmail || '',
      phone: '',
      company: '',
      notes: ''
    });
    onClose();
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors text-sm ${
              currentStep >= step ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              {currentStep > step ? <Check className="w-4 h-4" /> : step}
            </div>
            {step < 3 && (
              <div className={`w-8 h-1 rounded-full transition-colors ${
                currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const ServiceSelectionStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Service</h3>
        <p className="text-gray-600">Select the service that best fits your needs</p>
      </div>

      <div className="grid gap-4 max-h-[400px] overflow-y-auto">
        {services.map((service, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
            onClick={() => handleServiceSelect(service)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{service.description}</CardDescription>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                  <div className="text-xs text-gray-500">Starting from</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration || '2-4 weeks'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>Premium Quality</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(service.features || ['Custom Development', 'Quality Assurance', 'Support']).slice(0, 3).map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Select This Service <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const CustomerInfoStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Information</h3>
        <p className="text-gray-600">Tell us about yourself to proceed with the order</p>
      </div>

      {selectedService && (
        <Card className="bg-blue-50 border-blue-200 mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">{selectedService.title}</h4>
                <p className="text-sm text-gray-600">{selectedService.duration}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">${selectedService.price.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            placeholder="Your full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            value={customerInfo.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="company" className="text-sm font-medium">Company (Optional)</Label>
          <Input
            id="company"
            name="company"
            value={customerInfo.company}
            onChange={handleInputChange}
            placeholder="Your company name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium">Additional Notes (Optional)</Label>
          <textarea
            id="notes"
            name="notes"
            value={customerInfo.notes}
            onChange={handleInputChange}
            placeholder="Any specific requirements or questions..."
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={handleProceedToPayment} className="bg-blue-600 hover:bg-blue-700">
          Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const PaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Summary</h3>
        <p className="text-gray-600">Review your order and proceed to payment</p>
      </div>

      {selectedService && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{selectedService.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedService.description}</p>
                <p className="text-sm text-gray-500 mt-2">Duration: {selectedService.duration}</p>
              </div>
              <div className="text-right ml-4">
                <div className="text-xl font-bold">${selectedService.price.toLocaleString()}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-medium">{customerInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium">{customerInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-medium">{customerInfo.phone}</span>
              </div>
              {customerInfo.company && (
                <div className="flex justify-between">
                  <span>Company:</span>
                  <span className="font-medium">{customerInfo.company}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-blue-600">${selectedService.price.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="w-5 h-5 text-yellow-600 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">Payment Information</h4>
            <p className="text-sm text-yellow-700 mt-1">
              You'll be redirected to our secure payment processor (Paystack) to complete your payment. 
              Your order will be confirmed once payment is successful.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button 
          onClick={handlePayment} 
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${selectedService?.price.toLocaleString()}
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order a Service</span>
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
          <StepIndicator />
          
          {currentStep === 1 && <ServiceSelectionStep />}
          {currentStep === 2 && <CustomerInfoStep />}
          {currentStep === 3 && <PaymentStep />}
        </div>
      </DialogContent>
    </Dialog>
  );
}