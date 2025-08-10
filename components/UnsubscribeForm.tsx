'use client';
import React, { useEffect, useState } from 'react'
import Button from './ui/Button';
import { useSearchParams } from 'next/navigation';

export default function UnsubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'resubscribed'>('idle');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      if (status === 'idle') {
        handleUnsubscribe(emailParam);
      }
    }
  }, []); 

  const handleUnsubscribe = async (targetEmail?: string) => {
    setStatus('loading');
    const res = await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail || email }),
    });
    if (res.ok) {
      setStatus('success');
      setMessage('You have been unsubscribed from our newsletter.');
    } else {
      setStatus('error');
      const data = await res.json();
      setMessage(data.error || 'Something went wrong.');
    }
  };

  const handleResubscribe = async () => {
    setStatus('loading');
    const res = await fetch('/api/resubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus('resubscribed');
      setMessage('You have been resubscribed to our newsletter!');
    } else {
      setStatus('error');
      const data = await res.json();
      setMessage(data.error || 'Something went wrong.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleUnsubscribe();
  };

  const emailParam = searchParams.get('email');

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Unsubscribe from Newsletter</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Your email"
          className="w-full p-3 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={status === 'loading' || !!emailParam}
        />
        <Button
          text={status === 'loading' ? 'Unsubscribing...' : 'Unsubscribe'}
          type="submit"
          variant="primary"
          className="w-full"
          disabled={status === 'loading' || !!emailParam}
        />
      </form>
      {status === 'success' && (
        <div className="mt-6">
          <p className="text-green-600 mb-4">{message}</p>
          <Button
            text="Resubscribe"
            variant="secondary"
            className="w-full"
            onClick={handleResubscribe}
          />
        </div>
      )}
      {status === 'resubscribed' && (
        <p className="text-green-600 mt-4">{message}</p>
      )}
      {status === 'error' && <p className="text-red-600 mt-4">{message}</p>}
    </div>
  );
}
