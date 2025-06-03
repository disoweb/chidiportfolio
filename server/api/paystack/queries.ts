// server/api/paystack/queries.ts
import { db } from './db';
import { transactions, orders } from '@shared/schema';
import { desc, eq } from 'drizzle-orm';

export async function getTransactions() {
  return await db.query.transactions.findMany({
    with: {
      order: true
    },
    orderBy: [desc(transactions.createdAt)]
  });
}

export async function getTransactionByReference(reference: string) {
  return await db.query.transactions.findFirst({
    where: eq(transactions.reference, reference),
    with: {
      order: true
    }
  });
}