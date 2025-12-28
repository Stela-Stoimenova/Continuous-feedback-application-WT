// Displays app title, the user's name, and a logout button.
// Assumes `AuthProvider` has set `user` and `logout` in context.
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Activity } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/professor/activities" className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Continuous Feedback</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar








