import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Mail, User, CreditCard, ArrowRight, Download, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get payment data from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const service = urlParams.get('service');
    const amount = urlParams.get('amount');
    const email = urlParams.get('email');
    
    // Simulate payment data (in real app, this would come from your backend)
    const mockPaymentData = {
      reference: reference || 'PSK_' + Date.now(),
      service: service || 'Web Development',
      amount: amount || '150000',
      email: email || 'client@example.com',
      date: new Date().toLocaleDateString(),
      status: 'completed',
      projectId: 'PROJ_' + Date.now().toString().slice(-6),
      estimatedStartDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      estimatedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
    
    setPaymentData(mockPaymentData);
    setLoading(false);
  }, []);

  const handleGoToDashboard = () => {
    navigate('/client/dashboard');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleDownloadReceipt = () => {
    // Create a simple receipt download
    const receiptData = `
Payment Receipt
--------------
Service: ${paymentData.service}
Amount: ₦${parseInt(paymentData.amount).toLocaleString()}
Reference: ${paymentData.reference}
Date: ${paymentData.date}
Status: Completed

Thank you for your business!
Chidi Ogara - Senior Fullstack Developer
    `;
    
    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentData.reference}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Success Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for choosing my services. Your project is ready to begin!</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Your payment has been processed successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Service</label>
                    <p className="font-semibold">{paymentData.service}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Amount Paid</label>
                    <p className="font-semibold text-2xl text-green-600">
                      ₦{parseInt(paymentData.amount).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Payment Reference</label>
                    <p className="font-mono text-sm">{paymentData.reference}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p>{paymentData.date}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Project ID</label>
                    <p className="font-mono text-sm">{paymentData.projectId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Estimated Start Date</label>
                  <p className="font-semibold">{paymentData.estimatedStartDate}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Estimated Delivery</label>
                  <p className="font-semibold">{paymentData.estimatedDelivery}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Email Confirmation</p>
                      <p className="text-sm text-gray-600">Check your email for project details and next steps</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Initial Consultation</p>
                      <p className="text-sm text-gray-600">I'll reach out within 24 hours to discuss requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Project Kickoff</p>
                      <p className="text-sm text-gray-600">We'll schedule a call to finalize project scope</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button onClick={handleDownloadReceipt} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
          <Button onClick={handleGoToDashboard} className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button onClick={handleGoHome} variant="outline">
            Back to Homepage
          </Button>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about your project? I'm here to help!
              </p>
              <Button variant="outline" size="sm" className="flex items-center gap-2 mx-auto">
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}