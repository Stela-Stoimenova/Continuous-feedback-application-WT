// Students submit anonymous emoticon feedback for an activity.
// Generates a session ID per activity and shows status based on timing.
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { activityAPI, feedbackAPI } from '../../services/api'
import { getSessionId } from '../../utils/sessionId'
import { EMOTIONS } from '../../utils/emoticons'
import { formatDateTime, isActivityActive, getActivityStatus } from '../../utils/dateUtils'
import { Activity, CheckCircle, AlertCircle, Clock, Calendar } from 'lucide-react'

function StudentFeedback() {
  const { activityId } = useParams()
  const navigate = useNavigate()
  
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lastSubmitted, setLastSubmitted] = useState(null)
  const [submitCount, setSubmitCount] = useState(0)

  useEffect(() => {
    fetchActivity()
  }, [activityId])

  const fetchActivity = async () => {
    try {
      const response = await activityAPI.getAll()
      const found = response.data.activities?.find(a => a.id === activityId)
      
      if (!found) {
        // Try to get by code (for students who just joined)
        setError('Activity not found')
        setLoading(false)
        return
      }
      
      setActivity(found)
    } catch (err) {
      setError('Failed to load activity')
    } finally {
      setLoading(false)
    }
  }

  const handleEmotionClick = async (emotionValue) => {
    if (submitting) return

    setSubmitting(true)
    setError('')

    try {
      const sessionId = getSessionId(activityId)
      
      await feedbackAPI.submit({
        activity_id: activityId,
        emotion_type: emotionValue,
        anonymous_session_id: sessionId
      })

      setLastSubmitted(emotionValue)
      setSubmitCount(prev => prev + 1)
      
      // Clear success message after 2 seconds
      setTimeout(() => {
        setLastSubmitted(null)
      }, 2000)

    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error && !activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/student/join')}
              className="btn-primary"
            >
              Back to Join
            </button>
          </div>
        </div>
      </div>
    )
  }

  const status = getActivityStatus(activity.starts_at, activity.ends_at)
  const isActive = status === 'active'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Feedback Session</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-mono font-bold text-purple-600">
                    {activity.access_code}
                  </span>
                  <span>•</span>
                  <span className={`font-semibold ${
                    isActive ? 'text-green-600' : 
                    status === 'upcoming' ? 'text-blue-600' : 
                    'text-gray-600'
                  }`}>
                    {isActive ? '🟢 Active' : 
                     status === 'upcoming' ? '🔵 Starts Soon' : 
                     '⚫ Ended'}
                  </span>
                </div>
              </div>
            </div>
            {submitCount > 0 && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Feedback sent</div>
                <div className="text-2xl font-bold text-purple-600">{submitCount}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        {lastSubmitted && (
          <div className="mb-6 animate-bounce">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Feedback submitted successfully!</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Activity Info */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Session Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              <div>
                <div className="text-sm text-gray-500">Start Time</div>
                <div className="font-medium">{formatDateTime(activity.starts_at)}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              <div>
                <div className="text-sm text-gray-500">End Time</div>
                <div className="font-medium">{formatDateTime(activity.ends_at)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Emoticon Grid */}
        {isActive ? (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              How are you feeling?
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Click on an emoticon to share your feedback
            </p>

            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.value}
                  onClick={() => handleEmotionClick(emotion.value)}
                  disabled={submitting}
                  className={`
                    p-8 rounded-2xl border-4 transition-all duration-200
                    ${emotion.color}
                    ${lastSubmitted === emotion.value ? emotion.activeColor + ' scale-105' : ''}
                    ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'}
                  `}
                >
                  <div className="text-7xl mb-4 text-center">{emotion.emoji}</div>
                  <div className="text-xl font-bold text-gray-900 text-center">
                    {emotion.label}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
              Your feedback is completely anonymous • You can submit multiple times
            </p>
          </div>
        ) : status === 'upcoming' ? (
          <div className="card text-center py-12">
            <Clock className="w-20 h-20 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Session Hasn't Started Yet
            </h3>
            <p className="text-gray-600 mb-4">
              This feedback session will start at:
            </p>
            <p className="text-xl font-bold text-blue-600">
              {formatDateTime(activity.starts_at)}
            </p>
          </div>
        ) : (
          <div className="card text-center py-12">
            <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Session Has Ended
            </h3>
            <p className="text-gray-600 mb-4">
              This feedback session ended at:
            </p>
            <p className="text-xl font-bold text-gray-600">
              {formatDateTime(activity.ends_at)}
            </p>
            <button
              onClick={() => navigate('/student/join')}
              className="btn-primary mt-6"
            >
              Join Another Session
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentFeedback








