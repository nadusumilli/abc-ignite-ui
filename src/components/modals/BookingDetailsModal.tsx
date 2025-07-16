'use client';

import { X, User, Calendar, Clock, BookOpen } from 'lucide-react';
import { Booking } from '@/types';
import { format } from 'date-fns';

interface BookingDetailsModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Member</p>
              <p className="font-medium">{booking.member_name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Class</p>
              <p className="font-medium">{booking.class_name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Participation Date</p>
              <p className="font-medium">{format(new Date(booking.participation_date), 'MMM dd, yyyy')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Class Time</p>
              <p className="font-medium">{booking.class_start_time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 