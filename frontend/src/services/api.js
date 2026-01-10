// api service module
// handles all HTTP requests to the backend server using axios
// provides organized endpoints for authentication, activities, and feedback
// automatically attaches JWT tokens to authenticated requests

// Configures Axios client with baseURL and JSON headers.
// Attaches JWT from localStorage via request interceptor.
// Exposes typed API helpers for auth, activities, and feedback.
import axios from 'axios'

// base URL for all API requests
const API_URL = import.meta.env.VITE_API_URL || 
  `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;

// create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// request interceptor - adds JWT token to all requests
// retrieves token from localStorage and attaches it to Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// authentication API endpoints - handles user registration and login
export const authAPI = {
  // register a new professor account
  signup: (data) => api.post('/auth/signup', data),
  
  // authenticate existing user
  login: (data) => api.post('/auth/login', data),
}

// activity API endpoints - handles CRUD operations for feedback activities
export const activityAPI = {
  // create a new feedback activity with access code and time window
  create: (data) => api.post('/activities', data),
  
  // get all activities for the authenticated professor
  getAll: () => api.get('/activities'),
  
  // find an activity by its access code (used by students to join)
  getByCode: (code) => api.get(`/activities/${code}`),
  
  // get a specific activity by ID
  getById: (id) => api.get(`/activities/${id}`),
}

// feedback API endpoints - handles submission and retrieval of student feedback
export const feedbackAPI = {
  // submit anonymous feedback for an activity
  // emotion_type: 1=Happy, 2=Bored, 3=Surprised, 4=Confused
  submit: (data) => api.post('/feedbacks', data),
  
  // get all feedback for a specific activity
  // supports optional 'since' timestamp parameter for incremental updates
  getByActivity: (activityId, since = null) => {
    const url = since 
      ? `/feedbacks/${activityId}?since=${since}` 
      : `/feedbacks/${activityId}`
    return api.get(url)
  },
}

export default api
