import React from 'react';
import { Modal } from './ui/Modal';
import { Copy } from 'lucide-react';
import { Button } from './ui/Button';
import { useWalletStore } from '../lib/store';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiveModal({ isOpen, onClose }: ReceiveModalProps) {
  const address = useWalletStore((state) => state.address);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  if (!address) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receive BONSAI">
      <div className="flex flex-col items-center space-y-6">
        <div className="bg-white p-4 rounded-lg">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`}
            alt="Wallet Address QR Code"
            className="w-48 h-48"
          />
        </div>
        
        <div className="w-full">
          <p className="text-sm text-gray-400 mb-2">Your Wallet Address:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-gray-700/50 p-3 rounded-lg text-sm text-gray-200 font-mono break-all">
              {address}
            </code>
            <Button onClick={copyAddress} variant="secondary" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center">
          Scan this QR code or copy the address above to receive BONSAI tokens
        </p>
      </div>
    </Modal>
  );
}