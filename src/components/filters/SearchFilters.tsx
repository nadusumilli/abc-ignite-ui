'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchFiltersProps {
  filters: {
    memberName?: string;
    startDate?: string;
    endDate?: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Debounce the member name search
  const debouncedMemberName = useDebounce(localFilters.memberName, 500);
  
  // Debounce the date filters
  const debouncedStartDate = useDebounce(localFilters.startDate, 300);
  const debouncedEndDate = useDebounce(localFilters.endDate, 300);

  // Update parent when debounced values change
  useEffect(() => {
    onFiltersChange({
      memberName: debouncedMemberName,
      startDate: debouncedStartDate,
      endDate: debouncedEndDate,
    });
  }, [debouncedMemberName, debouncedStartDate, debouncedEndDate, onFiltersChange]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="card">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by member name..."
              value={localFilters.memberName || ''}
              onChange={(e) => handleFilterChange('memberName', e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={localFilters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="input-field"
            placeholder="Start date"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={localFilters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="input-field"
            placeholder="End date"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn-secondary flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}