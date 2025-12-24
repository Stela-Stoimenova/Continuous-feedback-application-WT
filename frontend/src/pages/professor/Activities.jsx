// Activities page
// Lists professor-owned activities and shows status badges.
// Fetches via `activityAPI.getAll()` and uses date utils for status.
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { activityAPI } from '../../services/api'
import { formatDateTime, getActivityStatus } from '../../utils/dateUtils'
import { Calendar, Clock, Key, ExternalLink, AlertCircle } from 'lucide-react'

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await activityAPI.getAll()
      setActivities(response.data.activities || [])
    } catch (err) {
      setError('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (startsAt, endsAt) => {
    const status = getActivityStatus(startsAt, endsAt)
    
    const badges = {
      active: 'bg-green-100 text-green-800 border-green-200',
      upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
      ended: 'bg-gray-100 text-gray-800 border-gray-200'
    }

    const labels = {
      active: '🟢 Active',
      upcoming: '🔵 Upcoming',
      ended: '⚫ Ended'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-600">Loading activities...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
        <span>{error}</span>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="card max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first feedback activity to get started
          </p>
          <Link to="/professor/create" className="btn-primary inline-block">
            Create Activity
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Activities</h1>
        <div className="text-sm text-gray-600">
          Total: {activities.length}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <div key={activity.id} className="card hover:shadow-xl transition-shadow">
            <div className="mb-4 flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {activity.access_code}
                </span>
              </div>
              {getStatusBadge(activity.starts_at, activity.ends_at)}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {formatDateTime(activity.starts_at)}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {formatDateTime(activity.ends_at)}
                </span>
              </div>
            </div>

            <Link
              to={`/professor/activity/${activity.id}`}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <span>View Dashboard</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Activities


