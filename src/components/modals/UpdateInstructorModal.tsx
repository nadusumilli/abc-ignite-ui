'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, User, Mail, Phone, Edit, Award } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Instructor, UpdateInstructorRequest } from '@/types';
import toast from 'react-hot-toast';
import { isValid, parseISO } from 'date-fns';

const updateInstructorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  bio: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
});

type UpdateInstructorForm = z.infer<typeof updateInstructorSchema>;

interface UpdateInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorData: Instructor | null;
}

const INSTRUCTOR_STATUSES = [
  { value: 'active', label: 'Active', color: 'text-green-600' },
  { value: 'inactive', label: 'Inactive', color: 'text-gray-600' },
  { value: 'suspended', label: 'Suspended', color: 'text-red-600' },
];

const SPECIALIZATIONS = [
  'yoga', 'pilates', 'cardio', 'strength', 'dance', 
  'martial-arts', 'swimming', 'cycling', 'boxing', 'crossfit',
  'meditation', 'stretching', 'hiit', 'zumba', 'spinning'
];

export default function UpdateInstructorModal({ isOpen, onClose, instructorData }: UpdateInstructorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateInstructorForm>({
    resolver: zodResolver(updateInstructorSchema),
  });

  const updateInstructorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInstructorRequest }) => 
      apiClient.updateInstructor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor updated successfully!');
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update instructor');
    },
  });

  const onSubmit = async (data: UpdateInstructorForm) => {
    if (!instructorData) return;
    
    setIsSubmitting(true);
    try {
      await updateInstructorMutation.mutateAsync({ id: instructorData.id, data });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Populate form when instructorData changes
  useEffect(() => {
    if (instructorData && isOpen) {
      reset({
        name: instructorData.name,
        email: instructorData.email,
        phone: instructorData.phone || '',
        specialization: instructorData.specialization || '',
        bio: instructorData.bio || '',
        status: instructorData.status,
      });
    }
  }, [instructorData, isOpen, reset]);

  if (!isOpen || !instructorData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Update Instructor
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
                Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  {...register('name')}
                  className="input-field pl-10"
                  placeholder="Enter instructor name"
                />
              </div>
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  {...register('email')}
                  className="input-field pl-10"
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-field pl-10"
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
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
                {INSTRUCTOR_STATUSES.map(status => (
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                {...register('specialization')}
                className="input-field pl-10"
              >
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map(spec => (
                  <option key={spec} value={spec}>
                    {spec.charAt(0).toUpperCase() + spec.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            {errors.specialization && (
              <p className="text-red-600 text-sm mt-1">{errors.specialization.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              {...register('bio')}
              className="input-field min-h-[100px] resize-none"
              placeholder="Tell us about the instructor's background, experience, and teaching style..."
              rows={4}
            />
            {errors.bio && (
              <p className="text-red-600 text-sm mt-1">{errors.bio.message}</p>
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
              {isSubmitting ? 'Updating...' : 'Update Instructor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 