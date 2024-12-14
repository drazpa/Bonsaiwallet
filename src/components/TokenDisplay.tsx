import React from 'react';

interface TokenDisplayProps {
  amount: string;
  className?: string;
}

export function TokenDisplay({ amount, className = '' }: TokenDisplayProps) {
  return (
    <span className={className}>
      {amount} <span className="text-sm text-gray-600">BONSAI</span>
    </span>
  );
}