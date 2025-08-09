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

    // Avoid duplicates
    const existing = await db.collection('subscribers').findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
    }

    await db.collection('subscribers').insertOne({
      email,
      subscribed: true,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
