'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, User, Mail, Phone, BookOpen, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Instructor } from '@/types';
import toast from 'react-hot-toast';

export default function InstructorsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: instructorsResponse, isLoading, error } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => apiClient.getAllInstructors(),
  });

  const { data: searchResponse } = useQuery({
    queryKey: ['instructors', 'search', searchQuery],
    queryFn: () => apiClient.searchInstructors(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const deleteInstructorMutation = useMutation({
    mutationFn: apiClient.deleteInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete instructor');
    },
  });

  const instructors = searchQuery.length >= 2 
    ? searchResponse?.data || []
    : instructorsResponse?.data || [];

  const handleDelete = async (instructor: Instructor) => {
    if (window.confirm(`Are you sure you want to delete ${instructor.name}?`)) {
      await deleteInstructorMutation.mutateAsync(instructor.id);
    }
  };

  const handleEdit = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load instructors</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Instructors</h2>
          <p className="text-gray-600">Manage your fitness instructors</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor: Instructor) => (
          <div
            key={instructor.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    instructor.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : instructor.status === 'inactive'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {instructor.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(instructor)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(instructor)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span>{instructor.email}</span>
              </div>
              
              {instructor.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{instructor.phone}</span>
                </div>
              )}
              
              {instructor.specialization && (
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>{instructor.specialization}</span>
                </div>
              )}
            </div>

            {instructor.bio && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 line-clamp-3">{instructor.bio}</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Created: {new Date(instructor.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(instructor.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {instructors.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No instructors found</h3>
          <p className="text-gray-600">
            {searchQuery.length >= 2 
              ? 'Try adjusting your search terms'
              : 'Get started by creating your first instructor'
            }
          </p>
        </div>
      )}

      {/* Edit Modal would go here - for now just a placeholder */}
      {isEditModalOpen && selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Instructor</h3>
            <p className="text-gray-600 mb-4">
              Edit functionality will be implemented here.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 