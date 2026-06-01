import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import WorkoutDetail from './pages/WorkoutDetail'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute' 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
          } />
        <Route path='/register' element={
          <PublicRoute>
            <Register />
          </PublicRoute>
          } />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/workouts/:id' element={
          <ProtectedRoute>
            <WorkoutDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App