'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Target, Activity, Clock, PieChart } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { format, subDays } from 'date-fns';
import LoadingSpinner from '../ui/LoadingSpinner';
import StatisticsCard from '../cards/StatisticsCard';
import BookingChart from '../charts/BookingChart';
import DateRangeFilter from '../filters/DateRangeFilter';

export default function StatisticsSection() {
  const [dateFilter, setDateFilter] = useState<{ startDate?: string; endDate?: string }>({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const {
    data: analyticsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['analytics-dashboard', dateFilter],
    queryFn: () => apiClient.getAnalyticsDashboard(dateFilter),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const analytics = analyticsResponse?.data || {
    classPerformance: {
      topClasses: [],
      averageMetrics: {
        fillRate: 0,
        attendanceRate: 0,
        noShowRate: 0,
        cancellationRate: 0
      },
      classTypeBreakdown: [],
      period: { startDate: 'all', endDate: 'all' }
    },
    memberEngagement: {
      activeMembers: [],
      retention: {
        totalMembers: 0,
        activeMembers: 0,
        recentMembers: 0,
        veryRecentMembers: 0,
        newMembers90d: 0,
        retainedMembers30d: 0,
        retentionRate30d: 0,
        engagementRate30d: 0
      },
      membershipBreakdown: [],
      period: { startDate: 'all', endDate: 'all' }
    },
    timeBasedTrends: {
      weeklyTrends: [],
      monthlyTrends: [],
      peakHours: [],
      dayOfWeekDemand: [],
      period: { startDate: 'all', endDate: 'all' }
    },
    operationalMetrics: {
      capacityMetrics: {
        totalClasses: 0,
        totalCapacity: 0,
        upcomingClasses: 0,
        pastClasses: 0,
        activeClasses: 0,
        cancelledClasses: 0,
        completedClasses: 0,
        totalBookings: 0,
        overallCapacityUtilization: 0
      },
      fillRateDistribution: [],
      period: { startDate: 'all', endDate: 'all' }
    }
  };

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
          Failed to load statistics
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
          <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>
          <p className="text-gray-600">
            Comprehensive analytics and insights
          </p>
        </div>
        
        <DateRangeFilter
          startDate={dateFilter.startDate}
          endDate={dateFilter.endDate}
          onDateChange={setDateFilter}
        />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Total Classes"
          value={analytics.operationalMetrics.capacityMetrics.totalClasses}
          icon={Calendar}
          color="blue"
        />
        
        <StatisticsCard
          title="Total Bookings"
          value={analytics.operationalMetrics.capacityMetrics.totalBookings}
          icon={Users}
          color="green"
        />
        
        <StatisticsCard
          title="Attendance Rate"
          value={`${(analytics.classPerformance.averageMetrics.attendanceRate * 100).toFixed(1)}%`}
          icon={TrendingUp}
          color="purple"
        />
        
        <StatisticsCard
          title="Capacity Utilization"
          value={`${(analytics.operationalMetrics.capacityMetrics.overallCapacityUtilization * 100).toFixed(1)}%`}
          icon={Target}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Booking Trends</h3>
            <p className="card-subtitle">
              Daily booking activity over time
            </p>
          </div>
          <div className="h-80">
            <BookingChart data={[]} />
          </div>
        </div>

        {/* Member Activity Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Member Engagement</h3>
            <p className="card-subtitle">
              Active members and retention metrics
            </p>
          </div>
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Active Members: {analytics.memberEngagement.retention.activeMembers}</p>
              <p>Retention Rate: {(analytics.memberEngagement.retention.retentionRate30d * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Peak Hours</h3>
            <p className="card-subtitle">
              Most popular class times
            </p>
          </div>
          <div className="space-y-4">
            {analytics.timeBasedTrends.peakHours.slice(0, 3).map((hour, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">
                  {hour.hour}:00 - {hour.hour + 1}:00
                </span>
                <span className="font-semibold">
                  {hour.bookingCount} bookings
                </span>
              </div>
            ))}
            {analytics.timeBasedTrends.peakHours.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No peak hours data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Classes</h3>
            <p className="card-subtitle">
              Most booked classes
            </p>
          </div>
          <div className="space-y-4">
            {analytics.classPerformance.topClasses.slice(0, 4).map((classItem, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600 truncate">
                  {classItem.className}
                </span>
                <span className="font-semibold">
                  {classItem.bookingCount} bookings
                </span>
              </div>
            ))}
            {analytics.classPerformance.topClasses.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                <PieChart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No class data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 