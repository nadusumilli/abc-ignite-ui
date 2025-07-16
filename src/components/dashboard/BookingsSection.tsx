'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Calendar, Users, Search, BarChart3, User } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Booking } from '@/types';
import { format } from 'date-fns';
import LoadingSpinner from '../ui/LoadingSpinner';
import BookingCard from '../cards/BookingCard';
import BookingDetailsModal from '../modals/BookingDetailsModal';
import BookingStatisticsModal from '../modals/BookingStatisticsModal';
import SearchFilters from '../filters/SearchFilters';

export default function BookingsSection() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    memberName?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const {
    data: bookingsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => apiClient.getAllBookings(filters),
  });

  const bookings = bookingsResponse?.data || [];
  const pagination = bookingsResponse?.data?.pagination;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium mb-2">
          Failed to load bookings
        </div>
        <div className="text-gray-600 mb-4">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </div>
        <button
          onClick={() => refetch()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-600">
            Manage and view all class bookings
            {pagination && (
              <span className="text-sm text-gray-500 ml-2">
                ({pagination.total} total)
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistics</span>
          </button>
        </div>
      </div>

      {/* Search Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination?.total || bookings.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(bookings.map(b => b.memberName)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => 
                  format(new Date(b.participationDate), 'yyyy-MM-dd') === 
                  format(new Date(), 'yyyy-MM-dd')
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {filters.memberName || filters.startDate || filters.endDate
              ? 'Try adjusting your search filters'
              : 'Get started by creating your first booking'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={() => setSelectedBooking(booking)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={pagination.page <= 1}
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      <BookingStatisticsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        filters={filters}
      />
    </div>
  );
} 