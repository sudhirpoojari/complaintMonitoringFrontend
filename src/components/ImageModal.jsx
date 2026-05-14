import React, { useEffect, useState } from "react";

export default function ImageModal({ isOpen, imageUrl, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = "hidden";
      setIsLoading(true);
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white p-2 rounded-xl shadow-2xl max-w-4xl w-full transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none shadow-lg z-10 transition-colors"
          title="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Image Container */}
        <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt="Complaint Evidence"
            className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}