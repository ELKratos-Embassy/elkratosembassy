import React from 'react'
import Button from './ui/Button'

export default function SuccessModal({setShowSuccess, message, onClick}: {
  setShowSuccess: (status: boolean) => void,
  message: string;
  onClick?: () => void;
}) {

  const handleClick = () => {
    if (onClick) onClick();
    setShowSuccess(false)

  }
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-extrabold mb-4 text-gradient-100">Thank you!</h2>
                {/* <p className="mb-6 text-gray-700">
                  Your message has been sent successfully.<br />
                  We appreciate your feedback and will get back to you soon.
                </p> */}
                <p className="mb-6 text-gray-700">
                  {message}
                </p>
                <Button
                  text="Close"
                  variant="primary"
                  className="w-full"
                  onClick={handleClick}
                />
              </div>
            </div>
  )
}
