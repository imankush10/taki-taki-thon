import React from 'react';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
    return <div className={`mb-4 ${className}`}>
        <div className="text-xl font-semibold text-white">{children}</div>
    </div>
}

export function CardContent({ children, className }) {
    return <div className={className}>{children}</div>
}