import { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
      setEmail('');
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
        aria-describedby="email-modal-description"
        className="
          max-w-full
          w-[70vw]
          sm:max-w-[425px]
          px-6
          py-5
          rounded-lg
          shadow-lg
          bg-white
          mx-auto
          outline-none
          focus:outline-none
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Enter Your Email
          </DialogTitle>
          <DialogDescription
            id="email-modal-description"
            className="text-center text-sm mt-1 mb-4"
          >
            Please enter a valid email address to proceed with the payment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <Input
            id="email"
            ref={inputRef}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-base py-3 px-4 rounded-md"
            disabled={isLoading}
            aria-invalid={!validateEmail(email) && email.length > 0}
            aria-describedby={!validateEmail(email) && email.length > 0 ? 'email-error' : undefined}
          />
          {!validateEmail(email) && email.length > 0 && (
            <p
              id="email-error"
              role="alert"
              className="text-red-600 text-sm mt-0.5"
            >
              Please enter a valid email address.
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !email}
            className="w-full py-3 text-base rounded-md flex justify-center items-center"
            aria-busy={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Continue to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
