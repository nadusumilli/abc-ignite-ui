'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface DashboardStatistics {
  overview: {
    totalClasses: number;
    totalBookings: number;
    totalMembers: number;
    totalInstructors: number;
    activeClasses: number;
    pendingBookings: number;
    todayBookings: number;
    thisWeekRevenue: number;
  };
  performance: {
    attendanceRate: number;
    capacityUtilization: number;
    cancellationRate: number;
    noShowRate: number;
    averageBookingsPerMember: number;
    averageRevenuePerClass: number;
  };
  trends: {
    weeklyBookings: Array<{ week: string; count: number; revenue: number }>;
    monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>;
    popularClasses: Array<{ name: string; bookings: number; revenue: number }>;
    topInstructors: Array<{ name: string; classes: number; attendance: number }>;
  };
  alerts: {
    lowAttendanceClasses: Array<{ classId: string; className: string; attendanceRate: number }>;
    highCancellationClasses: Array<{ classId: string; className: string; cancellationRate: number }>;
    upcomingFullClasses: Array<{ classId: string; className: string; capacity: number; bookings: number }>;
  };
}

export default function StatisticsSection() {
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getAnalyticsDashboard();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert variant="info">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No statistics data available
        </AlertDescription>
      </Alert>
    );
  }

  const getPerformanceColor = (value: number, threshold: number = 70) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (value: number, threshold: number = 70) => {
    if (value >= threshold) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value >= threshold * 0.8) return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overview.activeClasses} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overview.pendingBookings} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overview.totalInstructors} instructors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.overview.thisWeekRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overview.todayBookings} bookings today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            {getPerformanceIcon(stats.performance.attendanceRate)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(stats.performance.attendanceRate)}`}>
              {stats.performance.attendanceRate?.toFixed(1)}%
            </div>
            <Progress value={stats.performance.attendanceRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Target: 70%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
            {getPerformanceIcon(stats.performance.capacityUtilization)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(stats.performance.capacityUtilization)}`}>
              {stats.performance.capacityUtilization?.toFixed(1)}%
            </div>
            <Progress value={stats.performance.capacityUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Optimal: 80-90%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.performance.cancellationRate?.toFixed(1)}%
            </div>
            <Progress value={stats.performance.cancellationRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Target: &lt;15%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.performance.noShowRate?.toFixed(1)}%
            </div>
            <Progress value={stats.performance.noShowRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Target: &lt;10%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bookings/Member</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.performance.averageBookingsPerMember?.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Member engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Class</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.performance.averageRevenuePerClass?.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue efficiency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Low Attendance Alerts */}
        {stats.alerts.lowAttendanceClasses.length > 0 && (
          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Low Attendance Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.alerts.lowAttendanceClasses.slice(0, 3).map((classItem) => (
                <div key={classItem.classId} className="flex justify-between items-center text-sm">
                  <span className="truncate">{classItem.className}</span>
                  <Badge variant="destructive" className="text-xs">
                    {classItem.attendanceRate?.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* High Cancellation Alerts */}
        {stats.alerts.highCancellationClasses.length > 0 && (
          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                High Cancellation Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.alerts.highCancellationClasses.slice(0, 3).map((classItem) => (
                <div key={classItem.classId} className="flex justify-between items-center text-sm">
                  <span className="truncate">{classItem.className}</span>
                  <Badge variant="secondary" className="text-xs">
                    {classItem.cancellationRate?.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Full Classes */}
        {stats.alerts.upcomingFullClasses.length > 0 && (
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Upcoming Full Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.alerts.upcomingFullClasses.slice(0, 3).map((classItem) => (
                <div key={classItem.classId} className="flex justify-between items-center text-sm">
                  <span className="truncate">{classItem.className}</span>
                  <Badge variant="default" className="text-xs">
                    {classItem.bookings}/{classItem.capacity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Popular Classes & Top Instructors */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.trends.popularClasses.slice(0, 5).map((classItem, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{classItem.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{classItem.bookings} bookings</div>
                    <div className="text-sm text-muted-foreground">
                      ${classItem.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Instructors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.trends.topInstructors.slice(0, 5).map((instructor, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{instructor.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{instructor.classes} classes</div>
                    <div className="text-sm text-muted-foreground">
                      {instructor.attendance} attendees
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 