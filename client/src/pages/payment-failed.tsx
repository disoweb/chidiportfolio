import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentFailed() {
  const [, navigate] = useLocation();
  const [errorType, setErrorType] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error') || 'unknown';
    setErrorType(error);
  }, []);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'no-reference':
        return 'No payment reference was provided. Please try again.';
      case 'payment-not-successful':
        return 'Payment was not completed successfully. Please verify your payment details and try again.';
      case 'verification-failed':
        return 'Unable to verify payment status. Please contact support if you were charged.';
      case 'callback-error':
        return 'There was an error processing your payment callback. Please contact support.';
      default:
        return 'An unexpected error occurred while processing your payment. Please try again.';
    }
  };

  const handleRetry = () => {
    navigate('/#services');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    navigate('/#contact');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-red-200 dark:border-red-800 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-red-700 dark:text-red-300">
              Payment Failed
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              We couldn't process your payment
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                    What happened?
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {getErrorMessage(errorType)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                What you can do:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Check your internet connection</li>
                <li>• Verify your payment details</li>
                <li>• Try a different payment method</li>
                <li>• Contact us if the problem persists</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button 
                onClick={handleRetry} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <div className="flex gap-2">
                <Button 
                  onClick={handleContactSupport} 
                  variant="outline" 
                  className="flex-1"
                >
                  Contact Support
                </Button>
                <Button 
                  onClick={handleGoHome} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}