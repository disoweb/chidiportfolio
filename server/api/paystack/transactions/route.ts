// server/api/transactions/route.ts
import { getTransactions } from '../paystack/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const transactions = await getTransactions();
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}