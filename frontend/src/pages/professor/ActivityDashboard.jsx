// Displays charts, stats, and recent feedback for a selected activity.
// Fetches data via `activityAPI.getAll()` and `feedbackAPI.getByActivity(id)`.
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { activityAPI, feedbackAPI } from '../../services/api'
import { formatDateTime, getActivityStatus } from '../../utils/dateUtils'
import { EMOTIONS, getEmotionById } from '../../utils/emoticons'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Activity, Users, MessageSquare, Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react'

function ActivityDashboard() {
  const { id } = useParams()
  const [activity, setActivity] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      // Fetch activity details
      const activityResponse = await activityAPI.getAll()
      const foundActivity = activityResponse.data.activities.find(a => a.id === id)
      
      if (!foundActivity) {
        setError('Activity not found')
        setLoading(false)
        return
      }
      
      setActivity(foundActivity)

      // Fetch feedbacks
      await fetchFeedbacks()
    } catch (err) {
      setError('Failed to load activity data')
    } finally {
      setLoading(false)
    }
  }

  const fetchFeedbacks = async () => {
    try {
      const response = await feedbackAPI.getByActivity(id)
      setFeedbacks(response.data.feedbacks || [])
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err)
    }
  }

  // Calculate statistics
  const stats = {
    total: feedbacks.length,
    uniqueParticipants: new Set(feedbacks.map(f => f.anonymous_session_id).filter(Boolean)).size,
    byEmotion: EMOTIONS.map(emotion => ({
      ...emotion,
      count: feedbacks.filter(f => f.emotion_type === emotion.value).length
    }))
  }

  // Data for charts
  const barChartData = stats.byEmotion.map(e => ({
    name: e.label,
    count: e.count,
    emoji: e.emoji
  }))

  const pieChartData = stats.byEmotion.filter(e => e.count > 0).map(e => ({
    name: e.label,
    value: e.count
  }))

  const COLORS = ['#86efac', '#d1d5db', '#fde047', '#c4b5fd']

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
        <span>{error || 'Activity not found'}</span>
      </div>
    )
  }

  const status = getActivityStatus(activity.starts_at, activity.ends_at)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Activity Dashboard
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                <span className="font-mono font-bold text-xl text-blue-600">
                  {activity.access_code}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                status === 'active' ? 'bg-green-100 text-green-800' :
                status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {status === 'active' ? '🟢 Active' : 
                 status === 'upcoming' ? '🔵 Upcoming' : 
                 '⚫ Ended'}
              </span>
            </div>
          </div>
          <button
            onClick={fetchFeedbacks}
            className="btn-secondary text-sm px-4 py-2"
          >
            Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">Start: {formatDateTime(activity.starts_at)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">End: {formatDateTime(activity.ends_at)}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Feedback</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <MessageSquare className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Participants</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{stats.uniqueParticipants}</p>
            </div>
            <Users className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg per Student</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {stats.uniqueParticipants > 0 
                  ? (stats.total / stats.uniqueParticipants).toFixed(1) 
                  : '0'}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-400" />
          </div>
        </div>
      </div>

      {/* Charts */}
      {stats.total > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Feedback Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Emotion Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Feedback Yet</h3>
          <p className="text-gray-600">
            Share the access code <span className="font-mono font-bold text-blue-600">{activity.access_code}</span> with your students
          </p>
        </div>
      )}

      {/* Emotion Summary */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Emotion Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.byEmotion.map((emotion) => (
            <div
              key={emotion.value}
              className={`p-4 rounded-lg border-2 ${emotion.color}`}
            >
              <div className="text-4xl mb-2 text-center">{emotion.emoji}</div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{emotion.label}</div>
                <div className="text-2xl font-bold text-gray-900">{emotion.count}</div>
                <div className="text-sm text-gray-600">
                  {stats.total > 0 ? `${((emotion.count / stats.total) * 100).toFixed(1)}%` : '0%'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback */}
      {feedbacks.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Feedback</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {[...feedbacks].reverse().slice(0, 20).map((feedback, index) => {
              const emotion = getEmotionById(feedback.emotion_type)
              return (
                <div
                  key={feedback.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{emotion.emoji}</span>
                    <span className="font-medium text-gray-900">{emotion.label}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(feedback.created_at || feedback.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityDashboard

