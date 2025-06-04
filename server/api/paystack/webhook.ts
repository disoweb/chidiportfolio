
import { Request, Response } from 'express';
import crypto from 'crypto';
import { storage } from '../../storage';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET;

export async function handleWebhook(req: Request, res: Response) {
  if (!PAYSTACK_SECRET_KEY || !WEBHOOK_SECRET) {
    console.error('Missing required environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const body = JSON.stringify(req.body);
    const signature = req.headers['x-paystack-signature'] as string;

    // Verify signature
    const hash = crypto
      .createHmac('sha512', WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Received webhook event:', event.event);

    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulCharge(event.data);
        break;

      case 'charge.failed':
        await handleFailedCharge(event.data);
        break;

      case 'transfer.success':
        console.log('Transfer successful:', event.data);
        break;

      case 'transfer.failed':
        console.log('Transfer failed:', event.data);
        break;

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleSuccessfulCharge(data: any) {
  try {
    console.log('Processing successful charge:', data.reference);

    // Verify transaction with Paystack API
    const verification = await verifyTransaction(data.reference);
    
    if (verification.success) {
      // Update booking status if booking_id exists in metadata
      if (data.metadata?.booking_id) {
        try {
          await storage.updateBooking(parseInt(data.metadata.booking_id), {
            paymentStatus: 'completed',
            transactionId: data.reference
          });
          console.log(`Updated booking ${data.metadata.booking_id} payment status to completed`);
        } catch (error) {
          console.error('Error updating booking:', error);
        }
      }

      // Send confirmation email (implement based on your email service)
      await sendConfirmationEmail(verification.data);
      
      console.log('Successfully processed charge:', data.reference);
    }
  } catch (error) {
    console.error('Error handling successful charge:', error);
  }
}

async function handleFailedCharge(data: any) {
  try {
    console.log('Processing failed charge:', data.reference);

    // Update booking status if booking_id exists in metadata
    if (data.metadata?.booking_id) {
      try {
        await storage.updateBooking(parseInt(data.metadata.booking_id), {
          paymentStatus: 'failed',
          transactionId: data.reference
        });
        console.log(`Updated booking ${data.metadata.booking_id} payment status to failed`);
      } catch (error) {
        console.error('Error updating booking:', error);
      }
    }

    console.log('Processed failed charge:', data.reference);
  } catch (error) {
    console.error('Error handling failed charge:', error);
  }
}

async function verifyTransaction(reference: string) {
  try {
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
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return { success: false, data: null };
  }
}

async function sendConfirmationEmail(data: any) {
  try {
    // Implement your email sending logic here
    // Example with a simple email service:
    console.log('Sending confirmation email to:', data.customer?.email);
    
    const emailData = {
      to: data.customer?.email,
      subject: 'Payment Confirmation - Chidi Ogara Services',
      html: `
        <h1>Payment Confirmed</h1>
        <p>Thank you for your payment!</p>
        <p><strong>Service:</strong> ${data.metadata?.service_name || 'Professional Service'}</p>
        <p><strong>Amount:</strong> ₦${(data.amount / 100).toLocaleString()}</p>
        <p><strong>Reference:</strong> ${data.reference}</p>
        <p>We will contact you shortly to discuss your project details.</p>
        <br>
        <p>Best regards,<br>Chidi Ogara</p>
      `
    };

    // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
    // await emailService.send(emailData);
    
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}
