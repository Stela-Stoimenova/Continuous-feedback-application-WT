// date and time utility functions
// provides consistent date/time formatting and activity status checking
// uses Intl.DateTimeFormat API for internationalization

// format date string to display both date and time
// example: "Dec 5, 2024, 02:30 PM"
export function formatDateTime(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// format date string to display only the date
// example: "Dec 5, 2024"
export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// format date string to display only the time
// example: "02:30 PM"
export function formatTime(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// check if an activity is currently active
// returns true if current time is between start and end times
export function isActivityActive(startsAt, endsAt) {
  const now = new Date()
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  return now >= start && now <= end
}

// get the current status of an activity
// returns: 'upcoming', 'active', or 'ended'
export function getActivityStatus(startsAt, endsAt) {
  const now = new Date()
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  
  if (now < start) return 'upcoming'
  if (now > end) return 'ended'
  return 'active'
}

// format date for HTML datetime-local input
// converts date to "YYYY-MM-DDTHH:MM" format required by HTML5 inputs
export function formatDateTimeLocal(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}




