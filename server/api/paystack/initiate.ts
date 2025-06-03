// server/api/paystack/initiate.ts
import { db } from './db';
import { bookings } from '@shared/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';

export async function POST(req: Request) {
  const { email, amount, serviceId, serviceName, bookingId } = await req.json();

  try {
    // Create Paystack transaction
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100,
        metadata: {
          service_id: serviceId,
          service_name: serviceName,
          booking_id: bookingId
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update booking with payment reference
    await db.update(bookings)
      .set({ 
        paymentStatus: 'initiated',
        transactionId: response.data.data.reference
      })
      .where(eq(bookings.id, bookingId));

    return new Response(JSON.stringify({
      success: true,
      data: response.data.data
    }));

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error.response?.data?.message || 'Payment initiation failed'
    }), { status: 400 });
  }
}