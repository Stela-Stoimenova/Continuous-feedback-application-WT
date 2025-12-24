//Generate and manage anonymous session IDs
//Session ID is unique per device per activity

const STORAGE_KEY_PREFIX = 'feedback_session_'

//Generate a random session ID

function generateSessionId() {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  const randomPart2 = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${randomPart}-${randomPart2}`
}

/**
 * Get or create session ID for a specific activity
 * @param {string} activityId - The activity ID
 * @returns {string} The session ID
 */
export function getSessionId(activityId) {
  const storageKey = `${STORAGE_KEY_PREFIX}${activityId}`
  
  // Check if session ID exists for this activity
  let sessionId = sessionStorage.getItem(storageKey)
  
  if (!sessionId) {
    // Generate new session ID
    sessionId = generateSessionId()
    sessionStorage.setItem(storageKey, sessionId)
  }
  
  return sessionId
}

/**
 * Clear session ID for a specific activity
 * @param {string} activityId - The activity ID
 */
export function clearSessionId(activityId) {
  const storageKey = `${STORAGE_KEY_PREFIX}${activityId}`
  sessionStorage.removeItem(storageKey)
}

/**
 * Clear all session IDs
 */
export function clearAllSessionIds() {
  const keys = Object.keys(sessionStorage)
  keys.forEach(key => {
    if (key.startsWith(STORAGE_KEY_PREFIX)) {
      sessionStorage.removeItem(key)
    }
  })
}


