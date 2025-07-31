'use client';

import { useRef, useState } from 'react';
import Button from './ui/Button';

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      query: formData.get('query'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        form.reset();
        setShowSuccess(true);
      } else {
        alert('Failed to send message. Please try again later.');
      }
    } catch (error) {
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        ref={formRef}
        className="flex flex-col gap-6 w-full md:w-1/2"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <label htmlFor="name" className="sr-only">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Full Name"
            className="w-full rounded-lg p-4 placeholder:text-black/60 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            className="w-full rounded-lg p-4 placeholder:text-black/60 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="query" className="sr-only">
            Query Related
          </label>
          <input
            type="text"
            id="query"
            name="query"
            placeholder="Query Related"
            className="w-full rounded-lg p-4 placeholder:text-black/60 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Message"
            rows={4}
            className="w-full rounded-lg p-4 placeholder:text-black/60 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-y"
            required
            disabled={isSubmitting}
          />
        </div>
        <input
          type="hidden"
          name="submit_date"
          value={new Date().toISOString()}
        />

        <Button
          text={isSubmitting ? 'Sending...' : 'Send Message'}
          variant="primary"
          type="submit"
          className="w-full md:w-auto"
          disabled={isSubmitting}
        />
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-primary">Thank you!</h2>
            <p className="mb-6 text-gray-700">
              Your message has been sent successfully.<br />
              We appreciate your feedback and will get back to you soon.
            </p>
            <Button
              text="Close"
              variant="primary"
              className="w-full"
              onClick={() => setShowSuccess(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ContactForm;
