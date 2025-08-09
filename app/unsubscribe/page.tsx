'use client';

import { useState, useEffect, Suspense } from 'react';
import Button from '@/components/ui/Button';
import { useSearchParams } from 'next/navigation';


function FormSearchLoader() {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-8">
        <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="text-blue-600 font-medium">Processing your request...</span>
      </div>
    </>
  )
}

export default function UnsubscribePage() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

      <Suspense fallback={<FormSearchLoader />}>

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
      </Suspense>

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