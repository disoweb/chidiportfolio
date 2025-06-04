
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');
    
    const paymentRef = reference || trxref;
    
    if (!paymentRef) {
      setStatus('failed');
      setMessage('No payment reference found');
      return;
    }

    verifyPayment(paymentRef);
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      const response = await axios.post('/api/paystack/verify', {
        reference
      });

      if (response.data.success) {
        setStatus('success');
        setMessage('Payment verified successfully!');
        setPaymentDetails(response.data.data);
      } else {
        setStatus('failed');
        setMessage(response.data.message || 'Payment verification failed');
      }
    } catch (error: any) {
      setStatus('failed');
      setMessage(error.response?.data?.message || 'An error occurred during verification');
    }
  };

  const handleContinue = () => {
    navigate('/');
  };

  const handleRetry = () => {
    navigate('/#services');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <CardTitle>Processing Payment</CardTitle>
              <CardDescription>Please wait while we verify your payment...</CardDescription>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle className="text-green-600">Payment Successful!</CardTitle>
              <CardDescription>Your payment has been processed successfully.</CardDescription>
            </>
          )}
          
          {status === 'failed' && (
            <>
              <XCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <CardTitle className="text-red-600">Payment Failed</CardTitle>
              <CardDescription>There was an issue with your payment.</CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-gray-600">{message}</p>
          
          {paymentDetails && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Service:</span>
                <span>{paymentDetails.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>₦{paymentDetails.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Reference:</span>
                <span className="text-xs">{paymentDetails.reference}</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            {status === 'success' && (
              <Button onClick={handleContinue} className="w-full">
                Continue to Homepage
              </Button>
            )}
            
            {status === 'failed' && (
              <>
                <Button onClick={handleRetry} variant="outline" className="w-full">
                  Try Again
                </Button>
                <Button onClick={handleContinue} className="w-full">
                  Go Home
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
