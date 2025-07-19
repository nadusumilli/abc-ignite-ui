'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Clock, Users, DollarSign, MapPin, Tag, Edit } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Class, Instructor, UpdateClassRequest } from '@/types';
import { getErrorMessage, extractErrorCode } from '@/utils/errorMessages';
import toast from 'react-hot-toast';

const updateClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100, 'Class name must be less than 100 characters'),
  description: z.string().optional(),
  instructorId: z.string().min(1, 'Instructor is required'),
  instructorName: z.string().min(1, 'Instructor name is required'),
  classType: z.string().min(1, 'Class type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  durationMinutes: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration must be less than 8 hours'),
  maxCapacity: z.number().min(1, 'Capacity must be at least 1').max(100, 'Capacity must be less than 100'),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  location: z.string().optional(),
  room: z.string().optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']).default('all_levels'),
  status: z.enum(['active', 'cancelled', 'completed', 'inactive']).optional(),
});

type UpdateClassForm = z.infer<typeof updateClassSchema>;

interface UpdateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Class | null;
}

const CLASS_TYPES = [
  'yoga', 'pilates', 'cardio', 'strength', 'dance', 
  'martial-arts', 'swimming', 'cycling', 'boxing', 'crossfit'
];

const CLASS_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
  { value: 'inactive', label: 'Inactive' },
];

export default function UpdateClassModal({ isOpen, onClose, classData }: UpdateClassModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateClassForm>({
    resolver: zodResolver(updateClassSchema),
  });

  // Fetch instructors for dropdown
  const { data: instructorsResponse } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => apiClient.getAllInstructors({ status: 'active' }),
  });

  const instructors = instructorsResponse?.data || [];

  const updateClassMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassRequest }) => 
      apiClient.updateClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class updated successfully!');
      reset();
      setSelectedInstructor(null);
      onClose();
    },
    onError: (error: any) => {
      const errorCode = extractErrorCode(error);
      const userFriendlyMessage = getErrorMessage(errorCode, error.response?.data?.message);
      toast.error(userFriendlyMessage);
    },
  });

  const onSubmit = async (data: UpdateClassForm) => {
    if (!classData) return;
    
    setIsSubmitting(true);
    try {
      await updateClassMutation.mutateAsync({ id: classData.id, data });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle instructor selection
  const handleInstructorChange = (instructorId: string) => {
    const instructor = instructors.find(i => i.id === instructorId);
    if (instructor) {
      setSelectedInstructor(instructor);
      setValue('instructorId', instructor.id);
      setValue('instructorName', instructor.name);
    }
  };

  // Calculate end time based on start time and duration
  const startTime = watch('startTime');
  const durationMinutes = watch('durationMinutes');

  useEffect(() => {
    if (startTime && durationMinutes) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(start.getTime() + durationMinutes * 60000);
      const endTime = end.toTimeString().slice(0, 5);
      setValue('endTime', endTime);
    }
  }, [startTime, durationMinutes, setValue]);

  // Populate form when classData changes
  useEffect(() => {
    if (classData && isOpen) {
      // Format dates for HTML date inputs (YYYY-MM-DD)
      const formatDateForInput = (dateString: string | Date) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      reset({
        name: classData.name,
        description: classData.description || '',
        instructorId: classData.instructorId,
        instructorName: classData.instructorName || '',
        classType: classData.classType,
        startDate: formatDateForInput(classData.startDate),
        endDate: formatDateForInput(classData.endDate),
        startTime: classData.startTime,
        endTime: classData.endTime,
        durationMinutes: classData.durationMinutes,
        maxCapacity: classData.maxCapacity,
        price: classData.price,
        location: classData.location || '',
        room: classData.room || '',
        difficultyLevel: classData.difficultyLevel,
        status: classData.status,
      });

      // Set selected instructor
      const instructor = instructors.find(i => i.id === classData.instructorId);
      if (instructor) {
        setSelectedInstructor(instructor);
      }
    }
  }, [classData, isOpen, reset, instructors]);

  if (!isOpen || !classData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Update Class
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name *
              </label>
              <input
                type="text"
                {...register('name')}
                className="input-field"
                placeholder="Enter class name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Type *
              </label>
              <select
                {...register('classType')}
                className="input-field"
              >
                <option value="">Select class type</option>
                {CLASS_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
              {errors.classType && (
                <p className="text-red-600 text-sm mt-1">{errors.classType.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              className="input-field min-h-[80px] resize-none"
              placeholder="Describe the class..."
              rows={3}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor *
              </label>
              <select
                {...register('instructorId')}
                onChange={(e) => handleInstructorChange(e.target.value)}
                className="input-field"
              >
                <option value="">Select instructor</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name} {instructor.specialization && `(${instructor.specialization})`}
                  </option>
                ))}
              </select>
              {errors.instructorId && (
                <p className="text-red-600 text-sm mt-1">{errors.instructorId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="input-field"
              >
                {CLASS_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  {...register('startDate')}
                  className="input-field pl-10"
                />
              </div>
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  {...register('endDate')}
                  className="input-field pl-10"
                />
              </div>
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="time"
                  {...register('startTime')}
                  className="input-field pl-10"
                />
              </div>
              {errors.startTime && (
                <p className="text-red-600 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="time"
                  {...register('endTime')}
                  className="input-field pl-10"
                />
              </div>
              {errors.endTime && (
                <p className="text-red-600 text-sm mt-1">{errors.endTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                {...register('durationMinutes', { valueAsNumber: true })}
                className="input-field"
                min="15"
                max="480"
              />
              {errors.durationMinutes && (
                <p className="text-red-600 text-sm mt-1">{errors.durationMinutes.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Capacity *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  {...register('maxCapacity', { valueAsNumber: true })}
                  className="input-field pl-10"
                  min="1"
                  max="100"
                />
              </div>
              {errors.maxCapacity && (
                <p className="text-red-600 text-sm mt-1">{errors.maxCapacity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="input-field pl-10"
                  min="0"
                />
              </div>
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  {...register('location')}
                  className="input-field pl-10"
                  placeholder="Enter location"
                />
              </div>
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room
              </label>
              <input
                type="text"
                {...register('room')}
                className="input-field"
                placeholder="Enter room number/name"
              />
              {errors.room && (
                <p className="text-red-600 text-sm mt-1">{errors.room.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              {...register('difficultyLevel')}
              className="input-field"
            >
              <option value="all_levels">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.difficultyLevel && (
              <p className="text-red-600 text-sm mt-1">{errors.difficultyLevel.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 