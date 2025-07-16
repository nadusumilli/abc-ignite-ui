'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, User, Mail, Phone, BookOpen } from 'lucide-react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

const createInstructorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

type CreateInstructorForm = z.infer<typeof createInstructorSchema>;

interface CreateInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInstructorModal({ isOpen, onClose }: CreateInstructorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInstructorForm>({
    resolver: zodResolver(createInstructorSchema),
  });

  const createInstructorMutation = useMutation({
    mutationFn: apiClient.createInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor created successfully!');
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create instructor');
    },
  });

  const onSubmit = async (data: CreateInstructorForm) => {
    setIsSubmitting(true);
    try {
      await createInstructorMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Instructor</h2>
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
              Full Name *
            </label>
            <input
              type="text"
              {...register('name')}
              className="input-field"
              placeholder="Enter instructor name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              {...register('email')}
              className="input-field"
              placeholder="instructor@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="input-field"
              placeholder="+1-555-0123"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Specialization
            </label>
            <input
              type="text"
              {...register('specialization')}
              className="input-field"
              placeholder="e.g., Yoga, Pilates, Strength Training"
            />
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
              className="input-field min-h-[80px] resize-none"
              placeholder="Tell us about the instructor's experience and qualifications..."
              rows={3}
            />
            {errors.bio && (
              <p className="text-red-600 text-sm mt-1">{errors.bio.message}</p>
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
              {isSubmitting ? 'Creating...' : 'Create Instructor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 