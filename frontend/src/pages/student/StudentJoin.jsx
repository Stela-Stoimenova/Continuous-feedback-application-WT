// Students enter an access code to find an activity and navigate to its feedback page.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { activityAPI } from '../../services/api'
import { Activity, AlertCircle, ArrowRight } from 'lucide-react'

function StudentJoin() {
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!accessCode.trim()) {
      setError('Please enter an access code')
      return
    }

    setLoading(true)

    try {
      const response = await activityAPI.getByCode(accessCode.trim().toUpperCase())
      const activity = response.data.activity

      if (activity) {
        // Pass access code through the URL; StudentFeedback will fetch by code (public route)
        navigate(`/student/feedback/${activity.access_code}`)
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Invalid access code. Please check and try again.')
      } else {
        setError('Failed to join activity. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Activity className="w-20 h-20 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join Feedback Session
          </h1>
          <p className="text-lg text-gray-600">
            Enter the access code provided by your professor
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="accessCode" className="block text-lg font-semibold text-gray-900 mb-3 text-center">
                Access Code
              </label>
              <input
                id="accessCode"
                type="text"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="input-field text-center text-3xl font-bold tracking-widest uppercase"
                placeholder="ABC123"
                maxLength={10}
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Code is case-insensitive
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Joining...' : 'Join Session'}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Get the access code from your professor</li>
                <li>Enter the code above and click "Join Session"</li>
                <li>Share your feedback using emoticons</li>
                <li>Your feedback is completely anonymous</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Are you a professor?{' '}
            <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default StudentJoin








