export interface Class {
  id: string;
  name: string;
  description?: string;
  instructorId: string;
  classType: string;
  classDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  maxCapacity: number;
  price: number;
  location?: string;
  room?: string;
  equipmentNeeded?: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  tags?: string[];
  status: 'active' | 'cancelled' | 'completed' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  bio?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  classId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone?: string;
  participationDate: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'no_show';
  attendedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for display
  className?: string;
  classStartTime?: string;
  instructorName?: string;
}

export interface ClassStatistics {
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
  popularClasses: Array<{
    classId: string;
    className: string;
    bookingCount: number;
  }>;
  popularTimeSlots: Array<{
    timeSlot: string;
    bookingCount: number;
  }>;
}

export interface BookingStatistics {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  attendedBookings: number;
  noShowBookings: number;
  attendanceRate: number;
  popularTimeSlots: Array<{
    timeSlot: string;
    bookingCount: number;
  }>;
}

export interface InstructorStatistics {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  specializations: { [key: string]: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  filters?: Record<string, any>;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface SearchFilters {
  memberName?: string;
  startDate?: string;
  endDate?: string;
  classId?: string;
  status?: string;
}

export interface ClassFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  instructor?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface InstructorFilters {
  status?: string;
  specialization?: string;
}

// Request/Response types for API calls
export interface CreateClassRequest {
  name: string;
  description?: string;
  instructorId: string;
  classType: string;
  classDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  maxCapacity: number;
  price?: number;
  location?: string;
  room?: string;
  equipmentNeeded?: string[];
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  tags?: string[];
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {
  status?: 'active' | 'cancelled' | 'completed' | 'inactive';
}

export interface CreateInstructorRequest {
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  bio?: string;
}

export interface UpdateInstructorRequest {
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  bio?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface CreateBookingRequest {
  classId: string;
  memberId?: string; // Optional since backend handles member creation/lookup
  memberName: string;
  memberEmail: string;
  memberPhone?: string;
  participationDate: string;
  notes?: string;
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'no_show';
  attendedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
}

// Analytics Types
export interface ClassPerformanceAnalytics {
  topClasses: Array<{
    classId: string;
    className: string;
    classType: string;
    instructorName: string;
    bookingCount: number;
    maxCapacity: number;
    fillRate: number;
    attendedCount: number;
    noShowCount: number;
    attendanceRate: number;
    cancellationRate: number;
    classDate: string;
    startTime: string;
    endTime: string;
  }>;
  averageMetrics: {
    fillRate: number;
    attendanceRate: number;
    noShowRate: number;
    cancellationRate: number;
  };
  classTypeBreakdown: Array<{
    classType: string;
    totalClasses: number;
    totalBookings: number;
    avgFillRate: number;
    avgAttendanceRate: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface MemberEngagementAnalytics {
  activeMembers: Array<{
    memberId: string;
    memberName: string;
    memberEmail: string;
    membershipType: string;
    membershipStatus: string;
    totalBookings: number;
    attendedBookings: number;
    noShowBookings: number;
    cancelledBookings: number;
    attendanceRate: number;
    activeWeeks: number;
    classTypesTried: number;
    lastBookingDate: string;
    firstBookingDate: string;
    weeksSinceFirstBooking: number;
  }>;
  retention: {
    totalMembers: number;
    activeMembers: number;
    recentMembers: number;
    veryRecentMembers: number;
    newMembers90d: number;
    retainedMembers30d: number;
    retentionRate30d: number;
    engagementRate30d: number;
  };
  membershipBreakdown: Array<{
    membershipType: string;
    totalMembers: number;
    totalBookings: number;
    avgAttendanceRate: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface TimeBasedTrendAnalytics {
  weeklyTrends: Array<{
    weekStart: string;
    totalBookings: number;
    totalClasses: number;
    uniqueMembers: number;
    uniqueInstructors: number;
    avgFillRate: number;
    avgAttendanceRate: number;
  }>;
  monthlyTrends: Array<{
    monthStart: string;
    totalBookings: number;
    totalClasses: number;
    uniqueMembers: number;
    avgFillRate: number;
  }>;
  peakHours: Array<{
    hour: number;
    bookingCount: number;
    classCount: number;
    uniqueMembers: number;
    classTypes: number;
    avgFillRate: number;
    avgAttendanceRate: number;
  }>;
  dayOfWeekDemand: Array<{
    dayOfWeek: number;
    dayName: string;
    bookingCount: number;
    classCount: number;
    classTypes: number;
    uniqueMembers: number;
    uniqueInstructors: number;
    avgFillRate: number;
    avgAttendanceRate: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface OperationalMetricsAnalytics {
  capacityMetrics: {
    totalClasses: number;
    totalCapacity: number;
    upcomingClasses: number;
    pastClasses: number;
    activeClasses: number;
    cancelledClasses: number;
    completedClasses: number;
    totalBookings: number;
    overallCapacityUtilization: number;
  };
  fillRateDistribution: Array<{
    category: string;
    classCount: number;
    percentage: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface ComprehensiveAnalytics {
  classPerformance: ClassPerformanceAnalytics;
  memberEngagement: MemberEngagementAnalytics;
  timeBasedTrends: TimeBasedTrendAnalytics;
  operationalMetrics: OperationalMetricsAnalytics;
  generatedAt: string;
  period: {
    startDate: string;
    endDate: string;
  };
} 