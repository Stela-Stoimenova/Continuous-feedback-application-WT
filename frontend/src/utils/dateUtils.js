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

export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export function formatTime(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function isActivityActive(startsAt, endsAt) {
  const now = new Date()
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  return now >= start && now <= end
}

export function getActivityStatus(startsAt, endsAt) {
  const now = new Date()
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  
  if (now < start) return 'upcoming'
  if (now > end) return 'ended'
  return 'active'
}

export function formatDateTimeLocal(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}


