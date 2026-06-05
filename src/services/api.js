import axios from 'axios';

/** Base URL (empty since backend routes already include /api prefix). */
export const API_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const generateCrudApi = (endpoint) => ({
  getAll: (search = '') => apiClient.get(`/${endpoint}${search ? `?search=${search}` : ''}`).then(res => res.data),
  create: (data) => apiClient.post(`/${endpoint}`, data).then(res => res.data),
  update: (id, data) => apiClient.put(`/${endpoint}/${id}`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/${endpoint}/${id}`).then(res => res.data),
  exportUrl: `${API_URL}/${endpoint}/export`,
});

export const worksApi = generateCrudApi('works');
export const rawMaterialsApi = generateCrudApi('raw-materials');
export const vehiclesApi = generateCrudApi('vehicles');
export const driversApi = generateCrudApi('drivers');
export const usersManagementApi = generateCrudApi('manage/users');

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials).then(res => res.data),
  register: (data) => apiClient.post('/auth/register', data).then(res => res.data),
  googleLogin: (credential) => apiClient.post('/auth/google', { credential }).then(res => res.data),
  logout: () => apiClient.post('/auth/logout').then(res => res.data),
  getMe: () => apiClient.get('/user/me').then(res => res.data),
  selectRole: (role) => apiClient.post('/user/select-role', { role }).then(res => res.data),
};

export default apiClient;
