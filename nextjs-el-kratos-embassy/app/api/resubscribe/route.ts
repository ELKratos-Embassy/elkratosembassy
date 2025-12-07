import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db('church_website');
    const result = await db.collection('subscribers').updateOne(
      { email },
      { $set: { subscribed: true, resubscribedAt: new Date() } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Email not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Resubscribed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}