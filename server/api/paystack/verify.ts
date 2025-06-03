import { NextResponse } from 'next/server';
import axios from 'axios';

import { db } from '../../db';
import { transactions, orders } from '@shared/schema';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: Request) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { success: false, message: 'Server configuration error: Paystack secret key not found.' },
      { status: 500 }
    );
  }

  let requestBody;
  try {
    requestBody = await req.json();
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
  }

  const { reference, service: clientService, amount: clientAmount } = requestBody;

  if (!reference) {
    return NextResponse.json(
      { success: false, message: 'Reference is required' },
      { status: 400 }
    );
  }

  try {
    // Step 1: Verify with Paystack
    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackTransactionDetails = paystackResponse.data.data;

    if (!paystackTransactionDetails || paystackResponse.data.status === false) {
      return NextResponse.json(
        { success: false, message: paystackResponse.data.message || 'Failed to verify transaction with Paystack.' },
        { status: 400 }
      );
    }

    if (paystackTransactionDetails.status !== 'success') {
      return NextResponse.json(
        { success: false, message: `Payment not successful. Status: ${paystackTransactionDetails.status}` },
        { status: 400 }
      );
    }

    // Step 2: Verify amount matches
    if (clientAmount && (paystackTransactionDetails.amount / 100 !== clientAmount)) {
      console.warn(`Amount mismatch for reference ${reference}. Expected: ${clientAmount}, Got: ${paystackTransactionDetails.amount / 100}`);
      return NextResponse.json(
        { success: false, message: 'Amount mismatch after verification.' },
        { status: 400 }
      );
    }

    // Step 3: Save to database now that payment is verified
    let savedTransaction;
    try {
      [savedTransaction] = await db.insert(transactions).values({
        reference: paystackTransactionDetails.reference,
        amount: (paystackTransactionDetails.amount / 100).toFixed(2), // Ensure amount is a string with 2 decimal places
        currency: paystackTransactionDetails.currency || 'NGN',
        status: paystackTransactionDetails.status,
        serviceId: paystackTransactionDetails.metadata?.service_id as string | undefined,
        serviceName: (paystackTransactionDetails.metadata?.service_name as string | undefined) || clientService || 'Unknown Service',
        customerEmail: paystackTransactionDetails.customer?.email,
        metadata: paystackTransactionDetails.metadata
      }).returning();

      if (!savedTransaction) {
        throw new Error("Failed to save transaction and get returning value.");
      }

      // Create order
      await db.insert(orders).values({
        transactionId: savedTransaction.id,
        customerEmail: savedTransaction.customerEmail,
        serviceId: savedTransaction.serviceId,
        serviceName: savedTransaction.serviceName,
        status: 'paid'
      });

    } catch (dbError: any) {
      console.error('Database error after Paystack verification:', dbError);
      return NextResponse.json(
        { success: false, message: 'Payment verified, but failed to update database. Please contact support.' },
        { status: 500 }
      );
    }

    // Step 4: Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified and processed successfully.',
      data: {
        reference: paystackTransactionDetails.reference,
        amount: paystackTransactionDetails.amount / 100, // For the response, numeric is fine
        service: savedTransaction.serviceName,
        customerEmail: savedTransaction.customerEmail,
      }
    });

  } catch (error: any) {
    console.error('Payment verification process error:', error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { success: false, message: error.response.data?.message || 'Error verifying payment with Paystack.' },
        { status: error.response.status || 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred during payment verification.' },
      { status: 500 }
    );
  }
}