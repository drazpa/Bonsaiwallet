import React from 'react';

interface AddressDisplayProps {
  address: string;
  className?: string;
  shortened?: boolean;
}

export function AddressDisplay({ address, className = '', shortened = true }: AddressDisplayProps) {
  const displayAddress = shortened ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  
  return (
    <p className={className}>{displayAddress}</p>
  );
}