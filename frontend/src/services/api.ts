// src/services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Typed API calls ──────────────────────────────────────────────────────────

export const homeApi = {
  getHomeData: () => api.get('/home').then(r => r.data),
};

export const eventsApi = {
  getUpcoming:  () => api.get('/events/upcoming').then(r => r.data),
  getPast:      (page = 0) => api.get(`/events/past?page=${page}`).then(r => r.data),
  getBySlug:    (slug: string) => api.get(`/events/${slug}`).then(r => r.data),
  getNext:      () => api.get('/events/next').then(r => r.data),
};

export const libraryApi = {
  getLibrary:     () => api.get('/library').then(r => r.data),
  getMeditations: () => api.get('/library/meditations').then(r => r.data),
  getKirtan:      () => api.get('/library/kirtan').then(r => r.data),
  getTalks:       () => api.get('/library/talks').then(r => r.data),
  getItem:        (id: string) => api.get(`/library/${id}`).then(r => r.data),
  recordPlay:     (id: string) => api.post(`/library/${id}/play`),
};

export const authApi = {
  login:    (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(r => r.data),
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data).then(r => r.data),
  logout:   (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
};

export const profileApi = {
  getProfile:         () => api.get('/profile').then(r => r.data),
  getUpcomingEvents:  () => api.get('/profile/bookings/upcoming').then(r => r.data),
  getPastEvents:      () => api.get('/profile/bookings/past').then(r => r.data),
  updateProfile:      (data: any) => api.put('/profile', data).then(r => r.data),
};

export const adminApi = {
  createEvent:  (data: any) => api.post('/admin/events', data).then(r => r.data),
  updateEvent:  (id: string, data: any) => api.put(`/admin/events/${id}`, data).then(r => r.data),
  deleteEvent:  (id: string) => api.delete(`/admin/events/${id}`),
  createLibraryItem: (data: any) => api.post('/admin/library', data).then(r => r.data),
  updateLibraryItem: (id: string, data: any) => api.put(`/admin/library/${id}`, data).then(r => r.data),
  deleteLibraryItem: (id: string) => api.delete(`/admin/library/${id}`),
};
