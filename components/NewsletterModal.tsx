"use client";
import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import NewsletterForm from "./NewsletterForm";

const NewsletterModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <h2 className="text-h4 mb-6 text-center">Subscribe to our Newsletter</h2>
      <NewsletterForm />
    </Modal>
  );
};

export default NewsletterModal;
