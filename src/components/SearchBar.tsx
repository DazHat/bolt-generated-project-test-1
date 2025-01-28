import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  onAddNew: () => void;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  onAddNew,
}: SearchBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="">All Types</option>
            <option value="cCustomer">Customers</option>
            <option value="cSupplier">Suppliers</option>
            <option value="cLid">Leads</option>
          </select>
        </div>
        
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
        >
          Add New
        </button>
      </div>
    </div>
  );
}
