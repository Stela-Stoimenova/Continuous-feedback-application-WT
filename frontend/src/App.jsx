import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

// Auth pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Professor pages
import ProfessorLayout from './pages/professor/ProfessorLayout'
import CreateActivity from './pages/professor/CreateActivity'
import Activities from './pages/professor/Activities'
import ActivityDashboard from './pages/professor/ActivityDashboard'

// Student pages
import StudentJoin from './pages/student/StudentJoin'
import StudentFeedback from './pages/student/StudentFeedback'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Student routes (no auth needed) */}
          <Route path="/student/join" element={<StudentJoin />} />
          <Route path="/student/feedback/:activityId" element={<StudentFeedback />} />
          
          {/* Professor routes (protected) */}
          <Route path="/professor" element={<PrivateRoute><ProfessorLayout /></PrivateRoute>}>
            <Route path="create" element={<CreateActivity />} />
            <Route path="activities" element={<Activities />} />
            <Route path="activity/:id" element={<ActivityDashboard />} />
          </Route>
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App





