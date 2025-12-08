import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
}

// Activity API
export const activityAPI = {
  create: (data) => api.post('/activities', data),
  getAll: () => api.get('/activities'),
  getByCode: (code) => api.get(`/activities/${code}`),
  getById: (id) => api.get(`/activities/${id}`),
}

// Feedback API
export const feedbackAPI = {
  submit: (data) => api.post('/feedbacks', data),
  getByActivity: (activityId, since = null) => {
    const url = since 
      ? `/feedbacks/${activityId}?since=${since}` 
      : `/feedbacks/${activityId}`
    return api.get(url)
  },
}

export default api


