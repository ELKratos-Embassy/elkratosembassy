'use client';
import React, { useEffect, useState, useCallback } from 'react'
import Button from './ui/Button';
import { useSearchParams } from 'next/navigation';

export default function UnsubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'resubscribed'>('idle');
  const [message, setMessage] = useState('');
  const [resubLoading, setResubLoading] = useState(false);
  const [canResubscribe, setCanResubscribe] = useState(false);
  const searchParams = useSearchParams();

  // Check subscription status on mount or when email changes
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);

    const checkStatus = async (targetEmail: string) => {
      if (!targetEmail) return;
      const res = await fetch(`/api/subscriber-status?email=${encodeURIComponent(targetEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.subscribed === false) setCanResubscribe(true);
        else setCanResubscribe(false);
      }
    };

    if (emailParam) checkStatus(emailParam);
    else if (email) checkStatus(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, email]);

  const handleUnsubscribe = useCallback(async (targetEmail?: string) => {
    setStatus('loading');
    const res = await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail || email }),
    });
    if (res.ok) {
      setStatus('success');
      setMessage('You have been unsubscribed from our newsletter.');
      setCanResubscribe(true);
    } else {
      setStatus('error');
      const data = await res.json();
      setMessage(data.error || 'Something went wrong.');
    }
  }, [email]);

  const handleResubscribe = async () => {
    setResubLoading(true);
    const res = await fetch('/api/resubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus('resubscribed');
      setMessage('You have been resubscribed to our newsletter!');
      setCanResubscribe(false);
    } else {
      setStatus('error');
      const data = await res.json();
      setMessage(data.error || 'Something went wrong.');
    }
    setResubLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
          disabled={status === 'loading'}
        />
      </form>
      {(status === 'success' || canResubscribe) && (
        <div className="mt-6">
          {message && status !== 'error' && <p className="text-green-600 mb-4">{message}</p>}
          <Button
            text={resubLoading ? 'Resubscribing...' : 'Resubscribe'}
            variant="secondary"
            className="w-full"
            onClick={handleResubscribe}
            disabled={resubLoading}
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
