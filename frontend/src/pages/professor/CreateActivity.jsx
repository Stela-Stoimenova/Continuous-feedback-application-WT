import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { activityAPI } from '../../services/api'
import { AlertCircle, CheckCircle, Calendar, Clock, Key } from 'lucide-react'

function CreateActivity() {
  const [accessCode, setAccessCode] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setAccessCode(code)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!accessCode || !startsAt || !endsAt) {
      setError('All fields are required')
      return
    }

    const start = new Date(startsAt)
    const end = new Date(endsAt)

    if (end <= start) {
      setError('End time must be after start time')
      return
    }

    setLoading(true)

    try {
      const response = await activityAPI.create({
        access_code: accessCode,
        starts_at: start.toISOString(),
        ends_at: end.toISOString()
      })

      setSuccess(true)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/professor/activities')
      }, 2000)

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create activity')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Activity</h1>
        <p className="text-gray-600 mt-2">
          Set up a new feedback session for your students
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

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>Activity created successfully! Redirecting...</span>
            </div>
          )}

          {/* Access Code */}
          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4" />
                <span>Access Code</span>
              </div>
            </label>
            <div className="flex space-x-2">
              <input
                id="accessCode"
                type="text"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="input-field"
                placeholder="ABC123"
                maxLength={10}
              />
              <button
                type="button"
                onClick={generateCode}
                className="btn-secondary whitespace-nowrap"
              >
                Generate
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Students will use this code to join the session
            </p>
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="startsAt" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Start Time</span>
              </div>
            </label>
            <input
              id="startsAt"
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="input-field"
            />
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="endsAt" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>End Time</span>
              </div>
            </label>
            <input
              id="endsAt"
              type="datetime-local"
              required
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 btn-primary"
            >
              {loading ? 'Creating...' : 'Create Activity'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/professor/activities')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateActivity





