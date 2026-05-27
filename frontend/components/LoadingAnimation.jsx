import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
    </div>
  );
};

export default LoadingAnimation;