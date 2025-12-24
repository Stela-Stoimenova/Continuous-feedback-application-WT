// anonymous session ID management
// generates and manages unique session identifiers for anonymous student feedback
// each session ID is unique per device and per activity
// stored in sessionStorage (persists only while browser tab is open)
// this allows counting unique participants without identifying individuals

const STORAGE_KEY_PREFIX = 'feedback_session_'

// generate a cryptographically random session ID
// composed of timestamp + two random strings for uniqueness
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

// get or create a session ID for a specific activity
// if one exists, return it; otherwise generate and store a new one
// this ensures same student uses same ID throughout the session
export function getSessionId(activityId) {
  const storageKey = `${STORAGE_KEY_PREFIX}${activityId}`
  
  // check if session ID already exists for this activity
  let sessionId = sessionStorage.getItem(storageKey)
  
  if (!sessionId) {
    // generate new session ID if it doesn't exist
    sessionId = generateSessionId()
    // store it in sessionStorage for this activity
    sessionStorage.setItem(storageKey, sessionId)
  }
  
  return sessionId
}

// clear the session ID for a specific activity
export function clearSessionId(activityId) {
  const storageKey = `${STORAGE_KEY_PREFIX}${activityId}`
  sessionStorage.removeItem(storageKey)
}

// clear all session IDs from storage
// removes all feedback session IDs
export function clearAllSessionIds() {
  const keys = Object.keys(sessionStorage)
  // filter only keys that belong to feedback sessions
  keys.forEach(key => {
    if (key.startsWith(STORAGE_KEY_PREFIX)) {
      sessionStorage.removeItem(key)
    }
  })
}




