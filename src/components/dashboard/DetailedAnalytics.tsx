'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Target
} from 'lucide-react';

interface ClassStatistics {
  totalClasses: number;
  activeClasses: number;
  cancelledClasses: number;
  completedClasses: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  attendedBookings: number;
  noShowBookings: number;
  averageAttendance: number;
  attendanceRate: number;
  capacityUtilization: number;
  revenueGenerated: number;
  popularClasses: Array<{
    classId: string;
    className: string;
    bookingCount: number;
    attendanceRate: number;
    revenue: number;
  }>;
  popularTimeSlots: Array<{
    timeSlot: string;
    bookingCount: number;
    attendanceRate: number;
  }>;
  classTypeBreakdown: Array<{
    classType: string;
    count: number;
    attendanceRate: number;
    revenue: number;
  }>;
  instructorPerformance: Array<{
    instructorId: string;
    instructorName: string;
    classesCount: number;
    averageAttendance: number;
    totalRevenue: number;
  }>;
  weeklyTrends: Array<{
    week: string;
    classesCount: number;
    bookingsCount: number;
    attendanceRate: number;
    revenue: number;
  }>;
}

interface BookingStatistics {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  attendedBookings: number;
  noShowBookings: number;
  pendingBookings: number;
  attendanceRate: number;
  cancellationRate: number;
  noShowRate: number;
  averageBookingsPerMember: number;
  popularTimeSlots: Array<{
    timeSlot: string;
    bookingCount: number;
    attendanceRate: number;
  }>;
  memberEngagement: Array<{
    memberId: string;
    memberName: string;
    totalBookings: number;
    attendedBookings: number;
    attendanceRate: number;
    lastBookingDate: string;
  }>;
  bookingTrends: Array<{
    date: string;
    bookingsCount: number;
    attendanceCount: number;
    cancellationCount: number;
  }>;
  classPerformance: Array<{
    classId: string;
    className: string;
    bookingsCount: number;
    attendanceRate: number;
    averageCapacity: number;
  }>;
}

export default function DetailedAnalytics() {
  const [activeTab, setActiveTab] = useState<'classes' | 'bookings'>('classes');
  const [classStats, setClassStats] = useState<ClassStatistics | null>(null);
  const [bookingStats, setBookingStats] = useState<BookingStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchClassStatistics = async (classId: string) => {
    if (!classId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/analytics/classes/${classId}/statistics`);
      if (!response.ok) throw new Error('Failed to fetch class statistics');
      const data = await response.json();
      setClassStats(data.data);
    } catch (error) {
      console.error('Error fetching class statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingStatistics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      
      const response = await fetch(`http://localhost:3000/api/analytics/bookings/statistics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch booking statistics');
      const data = await response.json();
      setBookingStats(data.data);
    } catch (error) {
      console.error('Error fetching booking statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookingStatistics();
    }
  }, [activeTab, dateRange]);

  const getPerformanceColor = (value: number, threshold: number = 70) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        <Button
          variant={activeTab === 'classes' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('classes')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Class Analytics
        </Button>
        <Button
          variant={activeTab === 'bookings' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('bookings')}
        >
          <Users className="h-4 w-4 mr-2" />
          Booking Analytics
        </Button>
      </div>

      {/* Class Analytics */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          {/* Class Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Class Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="classId">Class ID</Label>
                  <Input
                    id="classId"
                    placeholder="Enter class ID (UUID)"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => fetchClassStatistics(selectedClassId)}
                  disabled={!selectedClassId || loading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? 'Loading...' : 'Get Statistics'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Class Statistics Display */}
          {classStats && (
            <div className="space-y-6">
              {/* Overview Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{classStats.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">
                      {classStats.confirmedBookings} confirmed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getPerformanceColor(classStats.attendanceRate)}`}>
                      {classStats.attendanceRate.toFixed(1)}%
                    </div>
                    <Progress value={classStats.attendanceRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getPerformanceColor(classStats.capacityUtilization)}`}>
                      {classStats.capacityUtilization.toFixed(1)}%
                    </div>
                    <Progress value={classStats.capacityUtilization} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${classStats.revenueGenerated.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total revenue
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{classStats.confirmedBookings}</div>
                      <div className="text-sm text-muted-foreground">Confirmed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{classStats.attendedBookings}</div>
                      <div className="text-sm text-muted-foreground">Attended</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{classStats.cancelledBookings}</div>
                      <div className="text-sm text-muted-foreground">Cancelled</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{classStats.noShowBookings}</div>
                      <div className="text-sm text-muted-foreground">No Show</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Time Slots */}
              {classStats.popularTimeSlots.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Time Slots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {classStats.popularTimeSlots.map((slot, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium">{slot.timeSlot}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{slot.bookingCount} bookings</div>
                            <div className="text-sm text-muted-foreground">
                              {slot.attendanceRate.toFixed(1)}% attendance
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* Booking Analytics */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Date Range Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={fetchBookingStatistics}
                  disabled={loading}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {loading ? 'Loading...' : 'Apply Filter'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Booking Statistics Display */}
          {bookingStats && (
            <div className="space-y-6">
              {/* Overview Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bookingStats.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">
                      {bookingStats.pendingBookings} pending
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getPerformanceColor(bookingStats.attendanceRate)}`}>
                      {bookingStats.attendanceRate.toFixed(1)}%
                    </div>
                    <Progress value={bookingStats.attendanceRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {bookingStats.cancellationRate.toFixed(1)}%
                    </div>
                    <Progress value={bookingStats.cancellationRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Bookings/Member</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {bookingStats.averageBookingsPerMember.toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Member engagement
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{bookingStats.confirmedBookings}</div>
                      <div className="text-sm text-muted-foreground">Confirmed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{bookingStats.attendedBookings}</div>
                      <div className="text-sm text-muted-foreground">Attended</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{bookingStats.pendingBookings}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{bookingStats.cancelledBookings}</div>
                      <div className="text-sm text-muted-foreground">Cancelled</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{bookingStats.noShowBookings}</div>
                      <div className="text-sm text-muted-foreground">No Show</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Member Engagement */}
              {bookingStats.memberEngagement.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Member Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bookingStats.memberEngagement.slice(0, 10).map((member, index) => (
                        <div key={member.memberId} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <span className="font-medium">{member.memberName}</span>
                              <div className="text-xs text-muted-foreground">
                                Last booking: {new Date(member.lastBookingDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{member.totalBookings} bookings</div>
                            <div className="text-sm text-muted-foreground">
                              {member.attendanceRate.toFixed(1)}% attendance
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Class Performance */}
              {bookingStats.classPerformance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Class Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bookingStats.classPerformance.slice(0, 10).map((classItem, index) => (
                        <div key={classItem.classId} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium">{classItem.className}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{classItem.bookingsCount} bookings</div>
                            <div className="text-sm text-muted-foreground">
                              {classItem.attendanceRate.toFixed(1)}% attendance
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 