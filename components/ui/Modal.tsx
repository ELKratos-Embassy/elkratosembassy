"use client";
import { useEffect, useState } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ open: _open, onClose, children }: ModalProps) => {
  // Show modal immediately on mount if open is true
  const [show, setShow] = useState(_open);
  useEffect(() => {
    setShow(_open);
  }, [_open]);
  useEffect(() => {
    if (!show) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60">
      <div className="bg-secondary-black text-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md relative animate-fadeIn mx-2 sm:mx-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-primary focus:outline-hidden"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
