'use client';

import { useRef, useState } from 'react';
import Button from './ui/Button';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Handle email submission
    try {
      if (formRef.current) {
        await emailjs.sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
          formRef.current as HTMLFormElement,
          {
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string,
          },
        );

        formRef.current.reset();
        alert('Message sent successfully');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};

export default ContactForm;
