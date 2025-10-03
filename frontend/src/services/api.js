import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============= AUTENTICACIÓN =============
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// ============= TIMELINE =============
export const timelineAPI = {
  getAll: () => api.get('/timeline'),
  create: (eventData) => api.post('/timeline', eventData),
  update: (id, eventData) => api.put(`/timeline/${id}`, eventData),
  delete: (id) => api.delete(`/timeline/${id}`),
};

// ============= MEMORIES =============
export const memoriesAPI = {
  getAll: () => api.get('/memories'),
  create: (formData) => {
    return api.post('/memories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, formData) => {
    return api.put(`/memories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/memories/${id}`),
};

// ============= SONGS =============
export const songsAPI = {
  getAll: () => api.get('/songs'),
  create: (songData) => api.post('/songs', songData),
  update: (id, songData) => api.put(`/songs/${id}`, songData),
  delete: (id) => api.delete(`/songs/${id}`),
};

// ============= MESSAGES =============
export const messagesAPI = {
  getAll: () => api.get('/messages'),
  create: (messageData) => api.post('/messages', messageData),
  delete: (id) => api.delete(`/messages/${id}`),
};

export default api;