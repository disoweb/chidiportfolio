import { db } from '../../db';
import { bookings } from '@shared/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { email, amount, serviceId, serviceName, bookingId } = await req.json();

    if (!email || !amount || !serviceId || !serviceName) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required fields: email, amount, serviceId, serviceName'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Payment configuration error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const paystackResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // convert to kobo
        metadata: {
          service_id: serviceId,
          service_name: serviceName,
          booking_id: bookingId
        },
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/callback`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (bookingId) {
      await db.update(bookings)
        .set({
          paymentStatus: 'initiated',
          transactionId: paystackResponse.data.data.reference
        })
        .where(eq(bookings.id, bookingId));
    }

    return new Response(JSON.stringify({
      success: true,
      data: paystackResponse.data.data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    if (error.response) {
      return new Response(JSON.stringify({
        success: false,
        message: error.response.data?.message || 'Paystack API error'
      }), {
        status: error.response.status || 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Payment initiation failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}