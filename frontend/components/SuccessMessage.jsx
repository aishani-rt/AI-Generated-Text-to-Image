import React, { useEffect, useState } from 'react';

const SuccessMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!isVisible) return null;

  return (
    <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-green-200 flex items-center gap-3 animate-slideIn">
      <span className="text-lg">✅</span>
      <p className="font-semibold">{message}</p>
    </div>
  );
};

export default SuccessMessage;