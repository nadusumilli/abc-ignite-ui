'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, TrendingUp, Users, DollarSign, Clock, Target, BarChart3, PieChart } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  startDate?: string;
  endDate?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard({ startDate, endDate }: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState({
    startDate: startDate || format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: endDate || format(new Date(), 'yyyy-MM-dd')
  });

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['analytics-dashboard', dateRange],
    queryFn: () => apiClient.getAnalyticsDashboard(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: classPerformance, isLoading: performanceLoading } = useQuery({
    queryKey: ['class-performance', dateRange],
    queryFn: () => apiClient.getClassPerformanceAnalytics(dateRange),
    staleTime: 5 * 60 * 1000,
  });

  const { data: memberEngagement, isLoading: engagementLoading } = useQuery({
    queryKey: ['member-engagement', dateRange],
    queryFn: () => apiClient.getMemberEngagementAnalytics(dateRange),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="card-header">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center text-red-600">
          <p>Failed to load analytics data</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary mt-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const data = dashboardData?.data;
  const performance = classPerformance?.data;
  const engagement = memberEngagement?.data;

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Analytics Dashboard
          </h3>
          <p className="card-subtitle">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="input-field mt-1"
            />
          </div>
          <button 
            onClick={() => setDateRange({
              startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
              endDate: format(new Date(), 'yyyy-MM-dd')
            })}
            className="btn-secondary"
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => setDateRange({
              startDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
              endDate: format(new Date(), 'yyyy-MM-dd')
            })}
            className="btn-secondary"
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Total Classes</h4>
              <div className="text-2xl font-bold">{data?.operationalMetrics?.capacityMetrics?.totalClasses || 0}</div>
              <p className="text-xs text-gray-500">
                {data?.operationalMetrics?.capacityMetrics?.activeClasses || 0} active
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Total Bookings</h4>
              <div className="text-2xl font-bold">{data?.operationalMetrics?.capacityMetrics?.totalBookings || 0}</div>
              <p className="text-xs text-gray-500">
                {data?.classPerformance?.averageMetrics?.attendanceRate ? 
                  `${(data.classPerformance.averageMetrics.attendanceRate * 100).toFixed(1)}%` : '0%'} attendance rate
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Capacity Utilization</h4>
              <div className="text-2xl font-bold">
                {data?.operationalMetrics?.capacityMetrics?.overallCapacityUtilization ? 
                  `${(data.operationalMetrics.capacityMetrics.overallCapacityUtilization * 100).toFixed(1)}%` : '0%'}
              </div>
              <p className="text-xs text-gray-500">
                Overall utilization
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Active Members</h4>
              <div className="text-2xl font-bold">{data?.memberEngagement?.retention?.activeMembers || 0}</div>
              <p className="text-xs text-gray-500">
                {data?.memberEngagement?.retention?.retentionRate30d ? 
                  `${(data.memberEngagement.retention.retentionRate30d * 100).toFixed(1)}%` : '0%'} retention rate
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Trends
            </h3>
            <p className="card-subtitle">Class creation and booking trends over time</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.timeBasedTrends?.weeklyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="weekStart" 
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalClasses" 
                  stroke="#8884d8" 
                  name="Classes Created"
                />
                <Line 
                  type="monotone" 
                  dataKey="totalBookings" 
                  stroke="#82ca9d" 
                  name="Bookings Made"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Peak Hours
            </h3>
            <p className="card-subtitle">Most popular class times</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.timeBasedTrends?.peakHours || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(value) => `${value}:00`} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookingCount" fill="#8884d8" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Type Performance */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Class Type Performance
            </h3>
            <p className="card-subtitle">Performance by class type</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.classPerformance?.classTypeBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="classType" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalBookings" fill="#8884d8" name="Total Bookings" />
                <Bar dataKey="avgAttendanceRate" fill="#82ca9d" name="Avg Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day of Week Demand */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Day of Week Demand
            </h3>
            <p className="card-subtitle">Booking demand by day of week</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data?.timeBasedTrends?.dayOfWeekDemand || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ dayName, bookingCount }) => `${dayName} (${bookingCount})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="bookingCount"
                >
                  {(data?.timeBasedTrends?.dayOfWeekDemand || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Classes */}
      {performance?.topClasses && performance.topClasses.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Performing Classes</h3>
            <p className="card-subtitle">Classes with highest booking counts and attendance rates</p>
          </div>
          <div className="space-y-4">
            {performance.topClasses.slice(0, 5).map((classItem: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{classItem.className}</h4>
                  <p className="text-sm text-gray-600">
                    {classItem.classType} • {classItem.instructorName}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{classItem.bookingCount} bookings</div>
                  <div className="text-sm text-gray-600">
                    {classItem.attendanceRate ? `${(classItem.attendanceRate * 100).toFixed(1)}%` : '0%'} attendance
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Engaged Members */}
      {engagement?.activeMembers && engagement.activeMembers.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Engaged Members</h3>
            <p className="card-subtitle">Members with highest booking counts and attendance rates</p>
          </div>
          <div className="space-y-4">
            {engagement.activeMembers.slice(0, 5).map((member: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{member.memberName}</h4>
                  <p className="text-sm text-gray-600">
                    {member.memberEmail} • {member.membershipType}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{member.totalBookings} bookings</div>
                  <div className="text-sm text-gray-600">
                    {member.attendanceRate ? `${(member.attendanceRate * 100).toFixed(1)}%` : '0%'} attendance
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fill Rate Distribution */}
      {data?.operationalMetrics?.fillRateDistribution && data.operationalMetrics.fillRateDistribution.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Fill Rate Distribution</h3>
            <p className="card-subtitle">Distribution of class capacity utilization</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.operationalMetrics.fillRateDistribution.map((item: any, index: number) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{item.classCount}</div>
                <div className="text-sm text-gray-600">{item.category}</div>
                <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 