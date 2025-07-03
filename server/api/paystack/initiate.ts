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
      console.error('Paystack secret key is not configured.'); // Added server-side logging for easier debugging
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
          booking_id: bookingId // Ensure bookingId is included if it exists
        },
        callback_url: `${process.env.REPLIT_DOMAINS 
          ? `https://${process.env.REPLIT_DOMAINS}` 
          : (process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://chidi.onrender.com')}/payment/callback`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (bookingId && paystackResponse.data && paystackResponse.data.data && paystackResponse.data.data.reference) {
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
    console.error('Payment initiation error:', error); // Log the actual error on the server

    if (error.response) {
      // Axios error (Paystack API returned an error)
      console.error('Paystack API error response:', error.response.data);
      return new Response(JSON.stringify({
        success: false,
        message: error.response.data?.message || 'Paystack API error',
        details: error.response.data // Optionally include more details if safe
      }), {
        status: error.response.status || 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Other errors (network issue, programming error, etc.)
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Payment initiation failed due to an unexpected error.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}