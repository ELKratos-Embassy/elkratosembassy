"use client";

import { useState } from "react";
import Button from "./ui/Button";
import SuccessModal from "./SuccessModal";
import { home } from "@/constants";
const {
  footer: {
    subscribe: {
      form: {
        input: { label, placeholder },
        btn: { text },
      },
    },
  },
} = home;

const NewsletterForm = ({ onSuccess, onClick }: { onSuccess?: () => void, onClick?: () => void }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("success");
      setEmail("");
      setShowSuccess(true);
      if (onSuccess) setTimeout(onSuccess, 1500); // Close modal after 1.5s
    } else {
      setStatus("error");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex justify-between md:justify-start gap-4 md:gap-6 flex-wrap"
      >
        <input
          aria-label={label}
          type="text"
          placeholder={placeholder}
          className="p-5 bg-transparent border opacity-35 placeholder:opacity-80  focus:opacity-100 border-opacity-75 -mr-1.5 rounded-lg transition-all -z-5 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          text={status === 'loading' ? 'Loading...' : text}
          variant="primary"
          type="submit"
          disabled={status === 'loading'}
          className="whitespace-nowrap"
        />
        {status === "error" && <p>Something went wrong.</p>}
      </form>
      {showSuccess && (
        <SuccessModal
          setShowSuccess={setShowSuccess}
          onClick={onClick}
          message="You have successfully subscribed to our newsletter!"
        />
      )}
    </>
  );
};

export default NewsletterForm;
