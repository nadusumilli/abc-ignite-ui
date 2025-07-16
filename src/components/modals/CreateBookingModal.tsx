'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, User, Calendar, BookOpen, Mail, Phone } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Class } from '@/types';
import toast from 'react-hot-toast';

const createBookingSchema = z.object({
  memberName: z.string().min(1, 'Member name is required').max(100, 'Member name must be less than 100 characters'),
  memberEmail: z.string().email('Invalid email format'),
  memberPhone: z.string().optional(),
  classId: z.string().min(1, 'Please select a class'),
  participationDate: z.string().min(1, 'Participation date is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type CreateBookingForm = z.infer<typeof createBookingSchema>;

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateBookingModal({ isOpen, onClose }: CreateBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookingForm>({
    resolver: zodResolver(createBookingSchema),
  });

  const { data: classesResponse, isLoading: classesLoading, error: classesError } = useQuery({
    queryKey: ['classes'],
    queryFn: () => apiClient.getAllClasses({ status: 'active' }),
  });
  
  // Fix: Access data correctly from flattened ApiResponse structure
  // Backend returns { success: true, data: Class[], pagination: {...} }
  const classes = (classesResponse as any)?.data || [];

  const createBookingMutation = useMutation({
    mutationFn: apiClient.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created successfully!');
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    },
  });

  const onSubmit = async (data: CreateBookingForm) => {
    setIsSubmitting(true);
    try {
      // Send the form data directly - backend will handle member creation/lookup
      await createBookingMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Member Name *
            </label>
            <input
              type="text"
              {...register('memberName')}
              className="input-field"
              placeholder="Enter member name"
            />
            {errors.memberName && (
              <p className="text-red-600 text-sm mt-1">{errors.memberName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              {...register('memberEmail')}
              className="input-field"
              placeholder="member@example.com"
            />
            {errors.memberEmail && (
              <p className="text-red-600 text-sm mt-1">{errors.memberEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              {...register('memberPhone')}
              className="input-field"
              placeholder="+1-555-0123"
            />
            {errors.memberPhone && (
              <p className="text-red-600 text-sm mt-1">{errors.memberPhone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Class *
            </label>
            <select
              {...register('classId')}
              className="input-field"
              disabled={classesLoading}
            >
              <option value="">
                {classesLoading ? 'Loading classes...' : 'Select a class'}
              </option>
              {classes.map((classItem: Class) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name} - {classItem.instructorName} - {classItem.startTime}
                </option>
              ))}
            </select>
            {classesError && (
              <p className="text-red-600 text-sm mt-1">Failed to load classes</p>
            )}
            {errors.classId && (
              <p className="text-red-600 text-sm mt-1">{errors.classId.message}</p>
            )}
            {/* Debug info */}
            <p className="text-xs text-gray-500 mt-1">
              {classesLoading ? 'Loading...' : `${classes.length} classes available`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Participation Date *
            </label>
            <input
              type="date"
              {...register('participationDate')}
              className="input-field"
            />
            {errors.participationDate && (
              <p className="text-red-600 text-sm mt-1">{errors.participationDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              className="input-field min-h-[80px] resize-none"
              placeholder="Any special requirements or notes..."
              rows={3}
            />
            {errors.notes && (
              <p className="text-red-600 text-sm mt-1">{errors.notes.message}</p>
            )}
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
              {isSubmitting ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}