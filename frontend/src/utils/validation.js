// Validation utility functions for form inputs

/**
 * Validates access code format
 * @param {string} code - Access code to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateAccessCode = (code) => {
  const trimmed = code.trim()
  
  // Empty or whitespace-only
  if (!trimmed) {
    return { isValid: false, error: 'Access code cannot be empty' }
  }
  
  // Length validation
  if (trimmed.length < 4) {
    return { isValid: false, error: 'Access code must be at least 4 characters' }
  }
  
  if (trimmed.length > 10) {
    return { isValid: false, error: 'Access code cannot exceed 10 characters' }
  }
  
  // Alphanumeric only (letters and numbers)
  const alphanumericRegex = /^[A-Z0-9]+$/i
  if (!alphanumericRegex.test(trimmed)) {
    return { isValid: false, error: 'Access code can only contain letters and numbers' }
  }
  
  return { isValid: true, error: '' }
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  const trimmed = email.trim()
  
  // Empty or whitespace-only
  if (!trimmed) {
    return { isValid: false, error: 'Email cannot be empty' }
  }
  
  // Very long emails (RFC 5321 limit is 320 characters, but we'll use 254 for practical purposes)
  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email address is too long' }
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  // Check for multiple @ symbols (redundant check after regex, but explicit)
  const atCount = (trimmed.match(/@/g) || []).length
  if (atCount !== 1) {
    return { isValid: false, error: 'Email address can only contain one @ symbol' }
  }
  
  // More detailed validation
  const parts = trimmed.split('@')
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid email format' }
  }
  
  const [localPart, domainPart] = parts
  
  // Local part validation
  if (!localPart || localPart.length === 0) {
    return { isValid: false, error: 'Email must have a local part before @' }
  }
  
  if (localPart.length > 64) {
    return { isValid: false, error: 'Email local part is too long' }
  }
  
  // Domain part validation
  if (!domainPart || domainPart.length === 0) {
    return { isValid: false, error: 'Email must have a domain after @' }
  }
  
  if (!domainPart.includes('.')) {
    return { isValid: false, error: 'Email domain must contain a dot (.)' }
  }
  
  const domainParts = domainPart.split('.')
  if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
    return { isValid: false, error: 'Email must have a valid domain extension' }
  }
  
  return { isValid: true, error: '' }
}

/**
 * Validates password
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePassword = (password) => {
  // Empty or whitespace-only
  if (!password || !password.trim()) {
    return { isValid: false, error: 'Password cannot be empty' }
  }
  
  // Too short
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' }
  }
  
  // Too long (DoS prevention - reasonable limit)
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long (maximum 128 characters)' }
  }
  
  // Check for whitespace
  if (password !== password.trim()) {
    return { isValid: false, error: 'Password cannot start or end with whitespace' }
  }
  
  return { isValid: true, error: '' }
}

/**
 * Validates date/time inputs for activity creation
 * @param {string} startsAt - Start date/time string
 * @param {string} endsAt - End date/time string
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateActivityDates = (startsAt, endsAt) => {
  // Check if dates are provided
  if (!startsAt || !endsAt) {
    return { isValid: false, error: 'Both start and end times are required' }
  }
  
  // Parse dates
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const now = new Date()
  
  // Check for invalid date format
  if (isNaN(start.getTime())) {
    return { isValid: false, error: 'Invalid start date format' }
  }
  
  if (isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid end date format' }
  }
  
  // Start time in the past
  if (start < now) {
    return { isValid: false, error: 'Start time cannot be in the past' }
  }
  
  // End time before start time
  if (end <= start) {
    return { isValid: false, error: 'End time must be after start time' }
  }
  
  // Same start and end time
  if (end.getTime() === start.getTime()) {
    return { isValid: false, error: 'Start and end times cannot be the same' }
  }
  
  // Very long duration (e.g., more than 1 year)
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000
  const duration = end.getTime() - start.getTime()
  if (duration > oneYearInMs) {
    return { isValid: false, error: 'Activity duration cannot exceed 1 year' }
  }
  
  // Very short duration (less than 1 minute) - optional check
  const oneMinuteInMs = 60 * 1000
  if (duration < oneMinuteInMs) {
    return { isValid: false, error: 'Activity duration must be at least 1 minute' }
  }
  
  return { isValid: true, error: '' }
}
