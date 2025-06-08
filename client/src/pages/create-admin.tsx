
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function CreateAdmin() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [credentials, setCredentials] = useState<any>(null);

  const createAdminAccount = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/seed-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setCredentials(data.credentials);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to create admin account');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Create Admin Account</CardTitle>
          <CardDescription>
            Set up admin access for the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'idle' && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Click the button below to create or reset the admin account.
              </p>
              <Button onClick={createAdminAccount} className="w-full">
                Create Admin Account
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Creating admin account...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Success!</span>
              </div>
              <p className="text-gray-600">{message}</p>
              
              {credentials && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-medium text-blue-900">Admin Credentials:</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Username:</strong> {credentials.username}</div>
                    <div><strong>Email:</strong> {credentials.email}</div>
                    <div><strong>Password:</strong> {credentials.password}</div>
                  </div>
                </div>
              )}

              <Button 
                onClick={() => window.location.href = '/admin/login'} 
                className="w-full"
              >
                Go to Admin Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-gray-600">{message}</p>
              <Button 
                onClick={() => setStatus('idle')} 
                variant="outline" 
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => window.location.href = '/'}
              className="text-sm"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
