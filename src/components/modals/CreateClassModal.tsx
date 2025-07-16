'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Clock, Users, DollarSign, MapPin, Tag } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Instructor } from '@/types';
import toast from 'react-hot-toast';

const createClassSchema = z.object({
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
});

type CreateClassForm = z.infer<typeof createClassSchema>;

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLASS_TYPES = [
  'yoga', 'pilates', 'cardio', 'strength', 'dance', 
  'martial-arts', 'swimming', 'cycling', 'boxing', 'crossfit'
];

export default function CreateClassModal({ isOpen, onClose }: CreateClassModalProps) {
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
  } = useForm<CreateClassForm>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      difficultyLevel: 'all_levels',
      price: 0,
    },
  });

  // Fetch instructors for dropdown
  const { data: instructorsResponse } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => apiClient.getAllInstructors({ status: 'active' }),
  });

  const instructors = instructorsResponse?.data || [];

  const createClassMutation = useMutation({
    mutationFn: apiClient.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class created successfully!');
      reset();
      setSelectedInstructor(null);
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create class');
    },
  });

  const onSubmit = async (data: CreateClassForm) => {
    setIsSubmitting(true);
    try {
      await createClassMutation.mutateAsync(data);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Class</h2>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date *
              </label>
              <input
                type="date"
                {...register('startDate')}
                className="input-field"
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                End Date *
              </label>
              <input
                type="date"
                {...register('endDate')}
                className="input-field"
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time *
              </label>
              <input
                type="time"
                {...register('startTime')}
                className="input-field"
              />
              {errors.startTime && (
                <p className="text-red-600 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                End Time *
              </label>
              <input
                type="time"
                {...register('endTime')}
                className="input-field"
                readOnly
              />
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
                <Users className="w-4 h-4 inline mr-1" />
                Max Capacity *
              </label>
              <input
                type="number"
                {...register('maxCapacity', { valueAsNumber: true })}
                className="input-field"
                min="1"
                max="100"
              />
              {errors.maxCapacity && (
                <p className="text-red-600 text-sm mt-1">{errors.maxCapacity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Price
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="input-field"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                {...register('location')}
                className="input-field"
                placeholder="e.g., Main Studio"
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Tag className="w-4 h-4 inline mr-1" />
                Room
              </label>
              <input
                type="text"
                {...register('room')}
                className="input-field"
                placeholder="e.g., Studio A"
              />
              {errors.room && (
                <p className="text-red-600 text-sm mt-1">{errors.room.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 