'use client';

import React from 'react';
import Button from './ui/Button';

const SermonForm = () => {
  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <label className="text-xs font-medium text-secondary/60" htmlFor="name">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your full name"
          className="w-full border-b border-secondary/20 py-2 px-0 focus:px-2 focus:border-primary focus:outline-hidden focus:ring-0 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-xs font-medium text-secondary/60"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          className="w-full border-b border-secondary/20 py-2 px-0 focus:px-2 focus:border-primary focus:outline-hidden focus:ring-0 transition-all"
        />
      </div>

      <Button text="Register Now" variant="primary" />
    </form>
  );
};

export default SermonForm;
