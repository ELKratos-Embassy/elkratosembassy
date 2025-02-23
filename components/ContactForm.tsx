'use client';

import { useState } from 'react';
import Button from './ui/Button';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
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
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Full Name"
          className="w-full rounded-lg p-4 placeholder:text-black/60 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          required
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
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full rounded-lg p-4 placeholder:text-black/60 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          required
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
          value={formData.query}
          onChange={handleChange}
          placeholder="Query Related"
          className="w-full rounded-lg p-4 placeholder:text-black/60 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message"
          rows={4}
          className="w-full rounded-lg p-4 placeholder:text-black/60 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-y"
          required
        />
      </div>

      <Button
        text="Send Message"
        variant="primary"
        type="submit"
        className="w-full md:w-auto"
      />
    </form>
  );
};

export default ContactForm;
