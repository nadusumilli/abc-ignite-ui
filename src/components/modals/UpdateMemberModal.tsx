'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, User, Mail, Phone, Calendar, Shield, Edit, Heart } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Member, UpdateMemberRequest } from '@/types';
import toast from 'react-hot-toast';

const updateMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  membershipType: z.enum(['standard', 'premium', 'vip']),
  membershipStatus: z.enum(['active', 'inactive', 'suspended', 'expired']),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  medicalNotes: z.string().optional(),
});

type UpdateMemberForm = z.infer<typeof updateMemberSchema>;

interface UpdateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberData: Member | null;
}

const MEMBERSHIP_TYPES = [
  { value: 'standard', label: 'Standard', color: 'text-blue-600' },
  { value: 'premium', label: 'Premium', color: 'text-purple-600' },
  { value: 'vip', label: 'VIP', color: 'text-yellow-600' },
];

const MEMBERSHIP_STATUSES = [
  { value: 'active', label: 'Active', color: 'text-green-600' },
  { value: 'inactive', label: 'Inactive', color: 'text-gray-600' },
  { value: 'suspended', label: 'Suspended', color: 'text-red-600' },
  { value: 'expired', label: 'Expired', color: 'text-orange-600' },
];

export default function UpdateMemberModal({ isOpen, onClose, memberData }: UpdateMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateMemberForm>({
    resolver: zodResolver(updateMemberSchema),
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberRequest }) => 
      apiClient.updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member updated successfully!');
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update member');
    },
  });

  const onSubmit = async (data: UpdateMemberForm) => {
    if (!memberData) return;
    
    setIsSubmitting(true);
    try {
      await updateMemberMutation.mutateAsync({ id: memberData.id, data });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Populate form when memberData changes
  useEffect(() => {
    if (memberData && isOpen) {
      reset({
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone || '',
        dateOfBirth: memberData.dateOfBirth ? new Date(memberData.dateOfBirth).toISOString().split('T')[0] : '',
        membershipType: memberData.membershipType,
        membershipStatus: memberData.membershipStatus,
        emergencyContactName: memberData.emergencyContactName || '',
        emergencyContactPhone: memberData.emergencyContactPhone || '',
        medicalNotes: memberData.medicalNotes || '',
      });
    }
  }, [memberData, isOpen, reset]);

  if (!isOpen || !memberData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Update Member
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
                  placeholder="Enter member name"
                />
              </div>
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
</rewritten_file>