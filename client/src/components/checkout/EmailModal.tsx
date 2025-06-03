import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export const EmailModal = ({
  isOpen,
  onClose,
  onEmailSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmit: (email: string) => Promise<void>;
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await onEmailSubmit(email);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process your email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="email-modal-description"  // <-- Added aria-describedby
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Enter Your Email</DialogTitle>
          <DialogDescription id="email-modal-description">
            Please enter a valid email address to proceed with the payment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isLoading || !email} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
