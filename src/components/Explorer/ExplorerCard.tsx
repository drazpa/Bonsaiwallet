import React from 'react';
import { Search, Database } from 'lucide-react';
import { BlockList } from './BlockList';
import { SearchBar } from './SearchBar';
import { useExplorer } from '../../hooks/useExplorer';

export function ExplorerCard() {
  const { searchResult, isLoading, error, searchBlockchain } = useExplorer();

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold text-gray-100">Blockchain Explorer</h2>
      </div>

      <SearchBar onSearch={searchBlockchain} isLoading={isLoading} />

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {searchResult && (
        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Search Result</h3>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(searchResult, null, 2)}
          </pre>
        </div>
      )}

      <BlockList />
    </div>
  );
}