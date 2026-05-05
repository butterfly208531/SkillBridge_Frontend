import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillbridge-backend2-h1u9.onrender.com/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 30000, // Set a timeout of 30 seconds
});


export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  priceOriginal: number;
  priceDiscounted: number;
  status: string;
  level: string;
  duration: string;
  imageUrl: string;
  reviews: number;
  rating: number;
  startDate: string;
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



export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get('/courses/landing');
    console.log('Courses fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses');
  }
};

export const fetchCategories = async (): Promise<any[]> => {
  try {
    const response = await api.get('/categories/navbar');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};