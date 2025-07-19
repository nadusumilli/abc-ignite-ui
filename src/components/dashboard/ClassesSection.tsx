'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Calendar, Clock, Users, Eye, BarChart3 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Class } from '@/types';
import { format } from 'date-fns';
import LoadingSpinner from '../ui/LoadingSpinner';
import ClassCard from '../cards/ClassCard';
import ClassDetailsModal from '../modals/ClassDetailsModal';
import ClassStatisticsModal from '../modals/ClassStatisticsModal';
import UpdateClassModal from '../modals/UpdateClassModal';
import DateRangeFilter from '../filters/DateRangeFilter';

export default function ClassesSection() {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedClassForStats, setSelectedClassForStats] = useState<Class | null>(null);
  const [selectedClassForUpdate, setSelectedClassForUpdate] = useState<Class | null>(null);
  const [dateFilter, setDateFilter] = useState<{ startDate?: string; endDate?: string }>({});

  const {
    data: classesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['classes', dateFilter],
    queryFn: () => apiClient.getAllClasses(dateFilter),
  });

  const classes = classesResponse?.data || [];
  const pagination = classesResponse?.pagination;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium mb-2">
          Failed to load classes
        </div>
        <div className="text-gray-600 mb-4">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </div>
        <button
          onClick={() => refetch()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Classes</h2>
          <p className="text-gray-600">
            Manage and view all fitness classes
            {pagination && (
              <span className="text-sm text-gray-500 ml-2">
                ({pagination.total} total)
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <DateRangeFilter
            startDate={dateFilter.startDate}
            endDate={dateFilter.endDate}
            onDateChange={setDateFilter}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination?.total || classes.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900">
                {classes.filter(c => new Date(c.classDate) >= new Date()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {classes.reduce((sum, c) => sum + c.maxCapacity, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-600">
            {dateFilter.startDate || dateFilter.endDate
              ? 'Try adjusting your date filters'
              : 'Get started by creating your first class'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onViewDetails={() => setSelectedClass(classItem)}
              onViewStatistics={() => setSelectedClassForStats(classItem)}
              onUpdate={() => setSelectedClassForUpdate(classItem)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={pagination.page <= 1}
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedClass && (
        <ClassDetailsModal
          classItem={selectedClass}
          isOpen={!!selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}

      {selectedClassForUpdate && (
        <UpdateClassModal
          classData={selectedClassForUpdate}
          isOpen={!!selectedClassForUpdate}
          onClose={() => setSelectedClassForUpdate(null)}
        />
      )}

      {selectedClassForStats && (
        <ClassStatisticsModal
          classItem={selectedClassForStats}
          isOpen={!!selectedClassForStats}
          onClose={() => setSelectedClassForStats(null)}
        />
      )}
    </div>
  );
}