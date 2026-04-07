import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className = "w-12 h-12" }: LoadingSpinnerProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <img 
        src="/assets/loader/stryd-loader.svg" 
        alt="Loading..." 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
