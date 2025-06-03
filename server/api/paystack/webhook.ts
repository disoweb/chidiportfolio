import { NextResponse } from 'next/server';
import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!PAYSTACK_SECRET_KEY || !WEBHOOK_SECRET) {
    console.error('Missing required environment variables');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify signature
    const hash = crypto
      .createHmac('sha512', WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case 'charge.success':
        // Handle successful charge
        const transaction = event.data;
        
        // Verify transaction with Paystack API
        const verification = await verifyTransaction(transaction.reference);
        
        if (verification.success) {
          // Save to database
          await saveTransaction(verification.data);
          
          // Send confirmation email
          await sendConfirmationEmail(verification.data);
        }
        
        break;

      // Add other event types as needed
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function verifyTransaction(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to verify transaction');
  }

  const data = await response.json();
  return {
    success: data.status,
    data: data.data
  };
}

async function saveTransaction(data: any) {
  // Implement your database save logic here
  // Example:
  // await prisma.transaction.create({ data: { ... } });
}

async function sendConfirmationEmail(data: any) {
  // Implement your email sending logic here
  // Example:
  // await resend.emails.send({ ... });
}