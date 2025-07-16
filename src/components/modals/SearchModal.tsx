'use client';

import { useState } from 'react';
import { X, Search, User, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Booking, Class } from '@/types';
import { format } from 'date-fns';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'bookings' | 'classes'>('bookings');

  const { data: bookingsResponse } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => apiClient.searchBookings(),
    enabled: searchType === 'bookings',
  });

  const { data: classesResponse } = useQuery({
    queryKey: ['classes'],
    queryFn: () => apiClient.getAllClasses(),
    enabled: searchType === 'classes',
  });

  // Fix: Access data directly
  const bookings = bookingsResponse?.data || [];
  const classes = classesResponse?.data || [];

  const filteredBookings = bookings.filter((booking: Booking) =>
    booking.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClasses = classes.filter((classItem: Class) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Search</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'bookings' | 'classes')}
              className="input-field"
            >
              <option value="bookings">Bookings</option>
              <option value="classes">Classes</option>
            </select>
          </div>

          <div className="space-y-4">
            {searchType === 'bookings' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Bookings</h3>
                {filteredBookings.length === 0 ? (
                  <p className="text-gray-500">No bookings found</p>
                ) : (
                  <div className="space-y-2">
                    {filteredBookings.map((booking: Booking) => (
                      <div key={booking.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{booking.memberName}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {booking.className} - {format(new Date(booking.participationDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {searchType === 'classes' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Classes</h3>
                {filteredClasses.length === 0 ? (
                  <p className="text-gray-500">No classes found</p>
                ) : (
                  <div className="space-y-2">
                    {filteredClasses.map((classItem: Class) => (
                      <div key={classItem.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="font-medium">{classItem.name}</div>
                        <div className="text-sm text-gray-600">
                          {format(new Date(classItem.startDate), 'MMM dd, yyyy')} - {classItem.startTime}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 