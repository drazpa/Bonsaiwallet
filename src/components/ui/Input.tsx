import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  darkMode?: boolean;
}

export function Input({ label, id, className = '', darkMode = false, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500
          ${darkMode 
            ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }
          ${className}
        `}
        {...props}
      />
    </div>
  );
}