'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, User, Edit, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Booking, Class, UpdateBookingRequest } from '@/types';
import { getErrorMessage, extractErrorCode } from '@/utils/errorMessages';
import toast from 'react-hot-toast';

const updateBookingSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  memberName: z.string().min(1, 'Member name is required'),
  memberEmail: z.string().email('Valid email is required'),
  memberPhone: z.string().optional(),
  participationDate: z.string().min(1, 'Participation date is required'),
  notes: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'attended', 'no_show']),
  cancellationReason: z.string().optional(),
});

type UpdateBookingForm = z.infer<typeof updateBookingSchema>;

interface UpdateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: Booking | null;
}

const BOOKING_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
  { value: 'confirmed', label: 'Confirmed', color: 'text-green-600' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' },
  { value: 'attended', label: 'Attended', color: 'text-blue-600' },
  { value: 'no_show', label: 'No Show', color: 'text-gray-600' },
];

export default function UpdateBookingModal({ isOpen, onClose, bookingData }: UpdateBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancellationReason, setShowCancellationReason] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateBookingForm>({
    resolver: zodResolver(updateBookingSchema),
  });

  // Watch status to show/hide cancellation reason
  const status = watch('status');

  // Fetch classes for dropdown
  const { data: classesResponse } = useQuery({
    queryKey: ['classes'],
    queryFn: () => apiClient.getAllClasses({ status: 'active' }),
  });

  const classes = classesResponse?.data || [];

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingRequest }) => 
      apiClient.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking updated successfully!');
      reset();
      onClose();
    },
    onError: (error: any) => {
      const errorCode = extractErrorCode(error);
      const userFriendlyMessage = getErrorMessage(errorCode, error.response?.data?.message);
      toast.error(userFriendlyMessage);
    },
  });

  const onSubmit = async (data: UpdateBookingForm) => {
    if (!bookingData) return;
    
    setIsSubmitting(true);
    try {
      await updateBookingMutation.mutateAsync({ id: bookingData.id, data });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Populate form when bookingData changes
  useEffect(() => {
    if (bookingData && isOpen) {
      // Format date for HTML date input (YYYY-MM-DD)
      const formatDateForInput = (dateString: string | Date) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      reset({
        classId: bookingData.classId,
        memberName: bookingData.memberName,
        memberEmail: bookingData.memberEmail,
        memberPhone: bookingData.memberPhone || '',
        participationDate: formatDateForInput(bookingData.participationDate),
        notes: bookingData.notes || '',
        status: bookingData.status,
        cancellationReason: bookingData.cancellationReason || '',
      });

      setShowCancellationReason(bookingData.status === 'cancelled');
    }
  }, [bookingData, isOpen, reset]);

  // Show/hide cancellation reason based on status
  useEffect(() => {
    setShowCancellationReason(status === 'cancelled');
  }, [status]);

  if (!isOpen || !bookingData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Update Booking
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
                Class *
              </label>
              <select
                {...register('classId')}
                className="input-field"
              >
                <option value="">Select class</option>
                {Array.isArray(classes) && classes.map((classItem: any) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} - {new Date(classItem.startDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {errors.classId && (
                <p className="text-red-600 text-sm mt-1">{errors.classId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                {...register('status')}
                className="input-field"
              >
                {BOOKING_STATUSES.map(statusOption => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
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
                Member Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  {...register('memberName')}
                  className="input-field pl-10"
                  placeholder="Enter member name"
                />
              </div>
              {errors.memberName && (
                <p className="text-red-600 text-sm mt-1">{errors.memberName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Email *
              </label>
              <input
                type="email"
                {...register('memberEmail')}
                className="input-field"
                placeholder="Enter member email"
              />
              {errors.memberEmail && (
                <p className="text-red-600 text-sm mt-1">{errors.memberEmail.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Phone
              </label>
              <input
                type="tel"
                {...register('memberPhone')}
                className="input-field"
                placeholder="Enter member phone"
              />
              {errors.memberPhone && (
                <p className="text-red-600 text-sm mt-1">{errors.memberPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participation Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  {...register('participationDate')}
                  className="input-field pl-10"
                />
              </div>
              {errors.participationDate && (
                <p className="text-red-600 text-sm mt-1">{errors.participationDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              className="input-field min-h-[80px] resize-none"
              placeholder="Add any additional notes..."
              rows={3}
            />
            {errors.notes && (
              <p className="text-red-600 text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>

          {showCancellationReason && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Cancellation Reason
              </label>
              <textarea
                {...register('cancellationReason')}
                className="input-field min-h-[80px] resize-none border-red-200 focus:border-red-500"
                placeholder="Please provide a reason for cancellation..."
                rows={3}
              />
              {errors.cancellationReason && (
                <p className="text-red-600 text-sm mt-1">{errors.cancellationReason.message}</p>
              )}
            </div>
          )}

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
              {isSubmitting ? 'Updating...' : 'Update Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 