import { Outlet, Link, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { Plus, List } from 'lucide-react'

function ProfessorLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation tabs */}
        <div className="mb-8 flex space-x-4 border-b border-gray-200">
          <Link
            to="/professor/activities"
            className={`px-4 py-3 font-semibold transition-colors flex items-center space-x-2 border-b-2 ${
              location.pathname === '/professor/activities'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-5 h-5" />
            <span>My Activities</span>
          </Link>
          <Link
            to="/professor/create"
            className={`px-4 py-3 font-semibold transition-colors flex items-center space-x-2 border-b-2 ${
              location.pathname === '/professor/create'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>Create Activity</span>
          </Link>
        </div>

        {/* Page content */}
        <Outlet />
      </div>
    </div>
  )
}

export default ProfessorLayout


