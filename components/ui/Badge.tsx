import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '', 
  onClick,
  active = false
}) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer select-none";
  
  const variants = {
    default: active 
      ? "border-transparent bg-teal-600 text-white shadow hover:bg-teal-700" 
      : "border-transparent bg-teal-100 text-teal-900 hover:bg-teal-200",
    secondary: active
      ? "border-transparent bg-indigo-600 text-white"
      : "border-transparent bg-indigo-100 text-indigo-900 hover:bg-indigo-200",
    outline: "text-slate-900 border border-slate-200 hover:bg-slate-100",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
