'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface DateRangeFilterProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (dates: { startDate?: string; endDate?: string }) => void;
}

export default function DateRangeFilter({ startDate, endDate, onDateChange }: DateRangeFilterProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  // Debounce the date changes
  const debouncedStartDate = useDebounce(localStartDate, 300);
  const debouncedEndDate = useDebounce(localEndDate, 300);

  // Update parent when debounced values change
  useEffect(() => {
    onDateChange({
      startDate: debouncedStartDate,
      endDate: debouncedEndDate,
    });
  }, [debouncedStartDate, debouncedEndDate, onDateChange]);

  // Sync local state with props
  useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  }, [startDate, endDate]);

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4 text-gray-500" />
      <input
        type="date"
        value={localStartDate || ''}
        onChange={(e) => setLocalStartDate(e.target.value)}
        className="input-field"
        placeholder="Start date"
      />
      <span className="text-gray-500">to</span>
      <input
        type="date"
        value={localEndDate || ''}
        onChange={(e) => setLocalEndDate(e.target.value)}
        className="input-field"
        placeholder="End date"
      />
    </div>
  );
}
