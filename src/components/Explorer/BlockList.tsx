import React, { useState } from 'react';
import { useBlocks } from '../../hooks/useBlocks';
import { formatDate } from '../../lib/utils';
import { Loader } from 'lucide-react';
import { BlockDetailsModal } from '../BlockDetailsModal';

export function BlockList() {
  const { blocks, isLoading } = useBlocks();
  const [selectedBlock, setSelectedBlock] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="w-6 h-6 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Latest Blocks</h3>
        <div className="space-y-3">
          {blocks.map((block) => (
            <div
              key={block.number}
              className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer"
              onClick={() => setSelectedBlock(block)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Block #{block.number}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(block.timestamp)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300">
                    {block.transactions.length} txns
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {block.gasUsed.toString()} gas used
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BlockDetailsModal
        isOpen={!!selectedBlock}
        onClose={() => setSelectedBlock(null)}
        block={selectedBlock}
      />
    </>
  );
}