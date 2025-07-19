import { Class } from '@/types';
import { Calendar, Clock, Users, Eye, BarChart3, User, DollarSign, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface ClassCardProps {
  classItem: Class;
  onViewDetails: () => void;
  onViewStatistics: () => void;
  onUpdate: () => void;
}

export default function ClassCard({ classItem, onViewDetails, onViewStatistics, onUpdate }: ClassCardProps) {
  const isActive = new Date(classItem.startDate) >= new Date();
  
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
          <p className="text-sm text-gray-600">
            {classItem.startDate ? format(new Date(classItem.startDate), 'MMM dd, yyyy') : 'N/A'}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isActive ? 'Active' : 'Ended'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{classItem.startTime} - {classItem.endTime} ({classItem.durationMinutes} min)</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>{classItem.instructorId}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>Capacity: {classItem.maxCapacity}</span>
        </div>
        
        {classItem.price > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>${classItem.price}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Created: {format(new Date(classItem.createdAt), 'MMM dd, yyyy')}</span>
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
        
        <button
          onClick={onViewStatistics}
          className="btn-secondary flex items-center justify-center space-x-1 text-sm px-3"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 