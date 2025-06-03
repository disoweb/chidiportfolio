import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
// Error 1: Ensure this path is correct and the module exists.
// Check tsconfig.json for '@/' alias and file system for the actual file.
import { useToast } from '@/components/ui/use-toast';
import { EmailModal } from './EmailModal';

export function PaymentButton({
  service,
  bookingId,
  amount
}: {
  service: { id: string; name: string };
  bookingId: number;
  amount: number;
}) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const router = useRouter(); // router is initialized but not used in the provided snippet. Remove if not needed.

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/paystack/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount,
          serviceId: service.id,
          serviceName: service.name,
          bookingId
        })
      });

      const data = await response.json();

      if (data.success && data.data.authorizationUrl) {
        window.location.href = data.data.authorizationUrl;
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="mr-2 h-4 w-4" />
        )}
        Pay Now
      </Button>

      <EmailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        // FIX: Make the handler async to match the expected type Promise<void>
        onEmailSubmit={async (submittedEmail) => { // Renamed 'email' to 'submittedEmail' to avoid conflict with state variable if any confusion.
          setEmail(submittedEmail);
          // Await initiatePayment if you need to ensure its completion before EmailModal considers this callback "done",
          // or if EmailModal does something after this promise resolves.
          // Otherwise, just calling it might be fine if the signature match is the only requirement.
          // However, to be safe and explicit, especially with UI flow, awaiting is often better.
          await initiatePayment();
        }}
      />
    </>
  );
}