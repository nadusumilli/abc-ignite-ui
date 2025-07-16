'use client';

import { X, Calendar, Clock, Users } from 'lucide-react';
import { Class } from '@/types';
import { format } from 'date-fns';

interface ClassDetailsModalProps {
  classItem: Class;
  isOpen: boolean;
  onClose: () => void;
}

export default function ClassDetailsModal({ classItem, isOpen, onClose }: ClassDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Class Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="font-medium text-lg">{classItem.name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span>
              {format(new Date(classItem.start_date), 'MMM dd, yyyy')} - {format(new Date(classItem.end_date), 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <span>
              {classItem.start_time} ({classItem.duration} min)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-500" />
            <span>Capacity: {classItem.capacity}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-500">Created:</span>
            <span>{format(new Date(classItem.created_at), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 