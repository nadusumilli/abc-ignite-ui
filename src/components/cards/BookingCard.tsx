import { Booking } from '@/types';
import { Calendar, User, Clock, Eye, Mail, Phone, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: Booking;
  onViewDetails: () => void;
  onUpdate: () => void;
}

export default function BookingCard({ booking, onViewDetails, onUpdate }: BookingCardProps) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{booking.memberName}</h3>
          <p className="text-sm text-gray-600">{booking.className || 'Class details loading...'}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          booking.status === 'confirmed' 
            ? 'bg-green-100 text-green-800'
            : booking.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : booking.status === 'cancelled'
            ? 'bg-red-100 text-red-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {booking.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Date: {format(new Date(booking.participationDate), 'MMM dd, yyyy')}</span>
        </div>
        
        {booking.classStartTime && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Class Time: {booking.classStartTime}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span>{booking.memberEmail}</span>
        </div>
        
        {booking.memberPhone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{booking.memberPhone}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>Booked: {format(new Date(booking.createdAt), 'MMM dd, yyyy')}</span>
        </div>
      </div>

      <div className="flex space-x-2">
      <button
        onClick={onViewDetails}
          className="btn-secondary flex-1 flex items-center justify-center space-x-1 text-sm"
      >
        <Eye className="w-4 h-4" />
          <span>Details</span>
        </button>
        
        <button
          onClick={onUpdate}
          className="btn-secondary flex items-center justify-center space-x-1 text-sm px-3"
        >
          <Edit className="w-4 h-4" />
      </button>
      </div>
    </div>
  );
} 