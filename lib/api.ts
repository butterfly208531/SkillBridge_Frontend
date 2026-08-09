// api.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillbridge-backend2.onrender.com/api';

// Custom error types
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any[];
  timestamp?: string;
}

// Course interface matching backend response
export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  priceOriginal: number;
  priceDiscounted: number;
  status: 'Active' | 'Inactive' | 'Draft';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  imageUrl: string;
  reviews: number;
  rating: number;
  startDate?: string;
  mode?: 'Online' | 'Physical' | 'Hybrid';
  studentsEnrolled: number;
  categoryId: string;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
  instructor: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    role: string;
    status: string;
  };
  modules: Array<{
    id: string;
    title: string;
    duration: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      order: number;
    }>;
  }>;
  learningOutcomes: Array<{ id: string; text: string }>;
  prerequisites: Array<{ id: string; text: string }>;
  enrollementYear: string;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  description: string;
  status: string;
  courses?: Course[];
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token — check both sessionStorage (user login) and localStorage
    const token = typeof window !== 'undefined'
      ? (sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken'))
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can transform response data here if needed
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle token refresh if 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Implement refresh token logic here
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        // localStorage.setItem('accessToken', response.data.accessToken);
        // originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        // return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const data = error.response?.data;
    
    console.error(`API Error ${statusCode}:`, message, data);
    throw new ApiError(statusCode, message, data);
  }
  
  console.error('Unknown error:', error);
  throw new ApiError(500, 'An unexpected error occurred');
};

// Fetch all courses for landing page
export const fetchCourses = async (params?: {
  category?: string;
  level?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<Course[]> => {
  try {
    const response = await api.get('/courses/landing', { params });
    
    // Handle different response structures
    let courses: Course[] = [];
    
    if (response.data?.data) {
      courses = response.data.data;
    } else if (Array.isArray(response.data)) {
      courses = response.data;
    } else if (response.data?.courses) {
      courses = response.data.courses;
    } else {
      courses = response.data || [];
    }
    
    console.log(`Fetched ${courses.length} courses successfully`);
    return courses;
  } catch (error) {
    // Return empty array instead of throwing — callers fall back to local store
    return [];
  }
};

// Fetch single course by ID — returns null on any error (caller handles fallback silently)
export const fetchCourseById = async (id: string): Promise<Course | null> => {
  try {
    const response = await api.get(`/courses/${id}`);
    let course: Course;
    if (response.data?.data) {
      course = response.data.data;
    } else {
      course = response.data;
    }
    return course;
  } catch (_) {
    return null;
  }
};

// Fetch course by slug — returns null on any error (caller handles fallback silently)
export const fetchCourseBySlug = async (slug: string): Promise<Course | null> => {
  try {
    const response = await api.get(`/courses/slug/${slug}`);
    
    let course: Course;
    if (response.data?.data) {
      course = response.data.data;
    } else {
      course = response.data;
    }
    
    return course;
  } catch (_) {
    return null;
  }
};

// Fetch all categories
export const fetchCategories = async (params?: {
  status?: string;
}): Promise<Category[]> => {
  try {
    const response = await api.get('/categories/navbar', { params });
    
    let categories: Category[] = [];
    
    if (response.data?.data) {
      categories = response.data.data;
    } else if (Array.isArray(response.data)) {
      categories = response.data;
    } else if (response.data?.categories) {
      categories = response.data.categories;
    } else {
      categories = response.data || [];
    }
    
    console.log(`Fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch courses by category
export const fetchCoursesByCategory = async (categoryId: string): Promise<Course[]> => {
  try {
    const response = await api.get(`/categories/${categoryId}/courses`);
    
    let courses: Course[] = [];
    if (response.data?.data) {
      courses = response.data.data;
    } else if (Array.isArray(response.data)) {
      courses = response.data;
    } else {
      courses = response.data?.courses || [];
    }
    
    return courses;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch featured courses
export const fetchFeaturedCourses = async (limit: number = 6): Promise<Course[]> => {
  try {
    const response = await api.get('/courses/featured', { params: { limit } });
    
    let courses: Course[] = [];
    if (response.data?.data) {
      courses = response.data.data;
    } else if (Array.isArray(response.data)) {
      courses = response.data;
    } else {
      courses = response.data?.courses || [];
    }
    
    return courses;
  } catch (error) {
    return handleApiError(error);
  }
};

// Search courses
export const searchCourses = async (query: string): Promise<Course[]> => {
  try {
    const response = await api.get('/courses/search', { params: { q: query } });
    
    let courses: Course[] = [];
    if (response.data?.data) {
      courses = response.data.data;
    } else if (Array.isArray(response.data)) {
      courses = response.data;
    } else {
      courses = response.data?.courses || [];
    }
    
    return courses;
  } catch (error) {
    return handleApiError(error);
  }
};

// Admin functions
export const adminApi = {
  // Create course
  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await api.post('/admin/courses', courseData);
      return response.data?.data || response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Update course
  updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await api.put(`/admin/courses/${id}`, courseData);
      return response.data?.data || response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Delete course
  deleteCourse: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/admin/courses/${id}`);
      return true;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Bulk upload courses
  bulkUploadCourses: async (courses: Partial<Course>[]): Promise<Course[]> => {
    try {
      const response = await api.post('/admin/courses/bulk', { courses });
      return response.data?.data || response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Utility function to transform API course to frontend format
export const transformCourseForFrontend = (course: Course) => {
  return {
    key: course.id,
    title: course.title,
    description: course.shortDescription || course.detailedDescription,
    category: course.category?.name || 'Uncategorized',
    level: course.level,
    duration: course.duration,
    rating: course.rating || 0,
    students: course.studentsEnrolled || 0,
    status: course.status || 'Active',
    image: course.imageUrl,
    instructorImage: course.instructor?.imageUrl || '',
    price: course.priceDiscounted || course.priceOriginal,
    slug: course.title.toLowerCase().replace(/\s+/g, '-'),
    instructorName: course.instructor?.name || 'Unknown Instructor'
  };
};

export default api;