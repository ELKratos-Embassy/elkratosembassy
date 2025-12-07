import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db('church_website');
  const subscriber = await db.collection('subscribers').findOne({ email });
  if (!subscriber) {
    return NextResponse.json({ subscribed: null });
  }
  return NextResponse.json({ subscribed: !!subscriber.subscribed });
}