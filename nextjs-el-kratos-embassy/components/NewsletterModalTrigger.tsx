"use client";
import { useState } from "react";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import NewsletterForm from "./NewsletterForm";

const NewsletterModalTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        text="Subscribe to Newsletter"
        variant="primary"
        className="rounded-lg"
        onClick={() => setOpen(true)}
      />
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-h4 mb-6 text-center">Subscribe to our Newsletter</h2>
        <NewsletterForm />
      </Modal>
    </>
  );
};

export default NewsletterModalTrigger;
