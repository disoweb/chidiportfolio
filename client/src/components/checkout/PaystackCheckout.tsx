import { usePaystackPayment } from 'react-paystack';
import { Button } from '@/components/ui/button'; 
import { Loader2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast'; 
import { useNavigate } from 'react-router-dom';   

interface PaystackProps {
  email: string;
  amount: number;
  metadata?: {
    [key: string]: any;
  };
  publicKey: string;
  reference: string;
  serviceName: string;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
}

export const PaystackCheckout = ({
  email,
  amount,
  metadata,
  publicKey,
  reference, 
  serviceName,
  onSuccess,
  onClose,
}: PaystackProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const config = {
    reference,
    email,
    amount: amount * 100,
    publicKey,
    metadata: {
      ...metadata,
      custom_fields: [
        {
          display_name: "Service",
          variable_name: "service",
          value: serviceName
        }
      ]
    },
    currency: 'NGN',
  };

  const initializePayment = usePaystackPayment(config);

  const handlePaymentSuccess = async (ref: any) => {
    const paymentReference = ref.reference || reference; 
    try {
    
      const response = await axios.post('/api/paystack/verify', {
        reference: paymentReference,
        service: serviceName,
        amount: amount
      });

      if (response.data.success) {
        toast({
          title: "Payment Successful",
          description: `Your payment for ${serviceName} has been completed.`,
          variant: "success",
        });
        
        navigate(`/payment/success?reference=${paymentReference}`); 
        
        onSuccess?.(paymentReference);
      } else {
       
        throw new Error(String(response.data.message) || "Payment verification failed");
      }
    } catch (error: any) {
      toast({
        title: "Verification Error",
        description: error.message || "We're having trouble verifying your payment.",
        variant: "destructive",
      });
      
      navigate(`/payment/failed?reference=${reference}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentClose = () => {
    setIsLoading(false);
    toast({
      title: "Payment Cancelled",
      description: "You can complete your payment later.",
      variant: "default",
    });
    onClose?.();
  };

  const handlePayment = () => {
    setIsLoading(true);
    initializePayment({
      onSuccess: handlePaymentSuccess,
      onClose: handlePaymentClose,
    });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Pay Now ({serviceName})
        </>
      )}
    </Button>
  );
};