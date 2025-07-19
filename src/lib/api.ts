import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Class, 
  Booking, 
  Instructor,
  ClassStatistics, 
  BookingStatistics, 
  InstructorStatistics,
  ApiResponse, 
  SearchFilters,
  ClassFilters,
  InstructorFilters,
  PaginatedResponse,
  CreateClassRequest,
  UpdateClassRequest,
  CreateInstructorRequest,
  UpdateInstructorRequest,
  CreateBookingRequest,
  UpdateBookingRequest,
  ComprehensiveAnalytics,
  ClassPerformanceAnalytics,
  MemberEngagementAnalytics,
  TimeBasedTrendAnalytics,
  OperationalMetricsAnalytics
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add request ID for tracking
        config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 429) {
          console.error('Rate limit exceeded');
        }
        return Promise.reject(error);
      }
    );
  }

  // Health check
  getHealth = async (): Promise<ApiResponse<any>> => {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Instructors API
  createInstructor = async (instructorData: CreateInstructorRequest): Promise<ApiResponse<Instructor>> => {
    const response = await this.client.post('/instructors', instructorData);
    return response.data;
  }

  getAllInstructors = async (filters?: InstructorFilters): Promise<ApiResponse<Instructor[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.specialization) params.append('specialization', filters.specialization);
    
    const response = await this.client.get(`/instructors?${params.toString()}`);
    return response.data;
  }

  getInstructorById = async (id: string): Promise<ApiResponse<Instructor>> => {
    const response = await this.client.get(`/instructors/${id}`);
    return response.data;
  }

  updateInstructor = async (id: string, updateData: UpdateInstructorRequest): Promise<ApiResponse<Instructor>> => {
    const response = await this.client.put(`/instructors/${id}`, updateData);
    return response.data;
  }

  deleteInstructor = async (id: string): Promise<ApiResponse<void>> => {
    const response = await this.client.delete(`/instructors/${id}`);
    return response.data;
  }

  searchInstructors = async (query: string): Promise<ApiResponse<Instructor[]>> => {
    const response = await this.client.get(`/instructors/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  getInstructorStatistics = async (): Promise<ApiResponse<InstructorStatistics>> => {
    const response = await this.client.get('/instructors/statistics');
    return response.data;
  }

  // Classes API
  createClass = async (classData: CreateClassRequest): Promise<ApiResponse<Class>> => {
    const response = await this.client.post('/classes', classData);
    return response.data;
  }

  getAllClasses = async (filters?: ClassFilters): Promise<ApiResponse<PaginatedResponse<Class>>> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.instructor) params.append('instructor', filters.instructor);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.orderBy) params.append('orderBy', filters.orderBy);
    if (filters?.orderDirection) params.append('orderDirection', filters.orderDirection);
    
    const response = await this.client.get(`/classes?${params.toString()}`);
    return response.data;
  }

  getClassById = async (id: string): Promise<ApiResponse<Class>> => {
    const response = await this.client.get(`/classes/${id}`);
    return response.data;
  }

  updateClass = async (id: string, updateData: UpdateClassRequest): Promise<ApiResponse<Class>> => {
    const response = await this.client.put(`/classes/${id}`, updateData);
    return response.data;
  }

  deleteClass = async (id: string): Promise<ApiResponse<void>> => {
    const response = await this.client.delete(`/classes/${id}`);
    return response.data;
  }

  getClassBookings = async (id: string): Promise<ApiResponse<Booking[]>> => {
    const response = await this.client.get(`/classes/${id}/bookings`);
    return response.data;
  }

  getClassStatistics = async (id: string): Promise<ApiResponse<ClassStatistics>> => {
    const response = await this.client.get(`/classes/${id}/statistics`);
    return response.data;
  }

  searchClasses = async (query: string, options?: { limit?: number; offset?: number; startDate?: string; endDate?: string }): Promise<ApiResponse<PaginatedResponse<Class>>> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    
    const response = await this.client.get(`/classes/search?${params.toString()}`);
    return response.data;
  }

  // Bookings API
  createBooking = async (bookingData: CreateBookingRequest): Promise<ApiResponse<Booking>> => {
    const response = await this.client.post('/bookings', bookingData);
    return response.data;
  }

  getAllBookings = async (filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Booking>>> => {
    const params = new URLSearchParams();
    if (filters?.memberName) params.append('memberName', filters.memberName);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.classId) params.append('classId', filters.classId);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await this.client.get(`/bookings?${params.toString()}`);
    return response.data;
  }

  getBookingById = async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await this.client.get(`/bookings/${id}`);
    return response.data;
  }

  updateBooking = async (id: string, updateData: UpdateBookingRequest): Promise<ApiResponse<Booking>> => {
    const response = await this.client.put(`/bookings/${id}`, updateData);
    return response.data;
  }

  deleteBooking = async (id: string): Promise<ApiResponse<void>> => {
    const response = await this.client.delete(`/bookings/${id}`);
    return response.data;
  }

  searchBookings = async (filters?: SearchFilters): Promise<ApiResponse<Booking[]>> => {
    const params = new URLSearchParams();
    if (filters?.memberName) params.append('memberName', filters.memberName);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.classId) params.append('classId', filters.classId);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await this.client.get(`/bookings/search?${params.toString()}`);
    return response.data;
  }

  getBookingStatistics = async (filters?: SearchFilters): Promise<ApiResponse<BookingStatistics>> => {
    const params = new URLSearchParams();
    if (filters?.memberName) params.append('memberName', filters.memberName);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.classId) params.append('classId', filters.classId);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await this.client.get(`/bookings/statistics?${params.toString()}`);
    return response.data;
  }

  getMemberHistory = async (memberName: string): Promise<ApiResponse<Booking[]>> => {
    const response = await this.client.get(`/bookings/member/${encodeURIComponent(memberName)}`);
    return response.data;
  }

  // Analytics API
  getAnalyticsDashboard = async (filters?: { startDate?: string; endDate?: string }): Promise<ApiResponse<ComprehensiveAnalytics>> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    // For analytics, we need to get all data, so we'll make multiple calls if needed
    // or handle the pagination properly
    const response = await this.client.get(`/analytics/dashboard?${params.toString()}`);
    return response.data;
  }

  getClassPerformanceAnalytics = async (filters?: { startDate?: string; endDate?: string; limit?: number }): Promise<ApiResponse<ClassPerformanceAnalytics>> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await this.client.get(`/analytics/class-performance?${params.toString()}`);
    return response.data;
  }

  getMemberEngagementAnalytics = async (filters?: { startDate?: string; endDate?: string; limit?: number }): Promise<ApiResponse<MemberEngagementAnalytics>> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await this.client.get(`/analytics/member-engagement?${params.toString()}`);
    return response.data;
  }

  getTimeBasedTrendAnalytics = async (filters?: { startDate?: string; endDate?: string }): Promise<ApiResponse<TimeBasedTrendAnalytics>> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const response = await this.client.get(`/analytics/time-trends?${params.toString()}`);
    return response.data;
  }

  getOperationalMetricsAnalytics = async (filters?: { startDate?: string; endDate?: string }): Promise<ApiResponse<OperationalMetricsAnalytics>> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const response = await this.client.get(`/analytics/operational-metrics?${params.toString()}`);
    return response.data;
  }
}

export const apiClient = new ApiClient(); 