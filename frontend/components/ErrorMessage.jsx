import React, { useEffect, useState } from 'react';

const ErrorMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!isVisible) return null;

  return (
    <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 flex items-start gap-3 animate-slideIn">
      <span className="text-lg">❌</span>
      <div>
        <p className="font-semibold">Error</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;