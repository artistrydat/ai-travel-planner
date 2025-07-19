import React from 'react';

interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ title, description, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-gray-800 text-white',
    destructive: 'bg-red-600 text-white',
    success: 'bg-green-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 ${variantClasses[variant]}`}>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};