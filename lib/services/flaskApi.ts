import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Trail, Activity, Profile } from '@/types/flask';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
}

class FlaskApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5000',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use((config) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Request:', config.method?.toUpperCase(), config.url);
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error:', error.response?.data || error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client(config);
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      return {
        status: 'error',
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Trail Service Methods
  async getTrails(): Promise<ApiResponse<Trail[]>> {
    return this.request({
      method: 'GET',
      url: '/api/maps/trails'
    });
  }

  async getTrailDetails(trailId: string): Promise<ApiResponse<Trail>> {
    return this.request({
      method: 'GET',
      url: `/api/maps/trails/${trailId}`
    });
  }

  // Activity Service Methods
  async logActivity(activity: Activity): Promise<ApiResponse<string>> {
    return this.request({
      method: 'POST',
      url: '/api/activities',
      data: activity
    });
  }

  async getActivity(activityId: string): Promise<ApiResponse<Activity>> {
    return this.request({
      method: 'GET',
      url: `/api/activities/${activityId}`
    });
  }

  // Profile Service Methods
  async getProfile(): Promise<ApiResponse<Profile>> {
    return this.request({
      method: 'GET',
      url: '/api/profile'
    });
  }

  async updateProfile(profileData: Partial<Profile>): Promise<ApiResponse<Profile>> {
    return this.request({
      method: 'PUT',
      url: '/api/profile',
      data: profileData
    });
  }

  async getAchievements(): Promise<ApiResponse<Array<{
    achievement: {
      id: number;
      name: string;
      description: string;
      xpReward: number;
    };
    unlockedAt: string;
  }>>> {
    return this.request({
      method: 'GET',
      url: '/api/profile/achievements'
    });
  }
}

export const flaskApiClient = new FlaskApiClient();
