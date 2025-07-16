'use client';

import { X, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { BookingStatistics } from '@/types';
import LoadingSpinner from '../ui/LoadingSpinner';

interface BookingStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters?: {
    memberName?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default function BookingStatisticsModal({ isOpen, onClose, filters }: BookingStatisticsModalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['booking-statistics', filters],
    queryFn: () => apiClient.getBookingStatistics(filters),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Booking Statistics
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-red-600">Failed to load statistics.</div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="font-medium">Total Bookings:</span>{' '}
                {data?.data?.totalBookings ?? 0}
              </div>
              <div>
                <span className="font-medium">Confirmed Bookings:</span>{' '}
                {data?.data?.confirmedBookings ?? 0}
              </div>
              <div>
                <span className="font-medium">Attendance Rate:</span>{' '}
                {data?.data?.attendanceRate ? `${(data.data.attendanceRate * 100).toFixed(1)}%` : '0%'}
              </div>
              {/* Add more stats as needed */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 