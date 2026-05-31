import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import WorkoutCard from '../components/WorkoutCard'

function Dashboard() {
  const [workouts, setWorkouts] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    api.get('/workouts')
      .then(response => setWorkouts(response.data))
      .catch(() => navigate('/'))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleCreateWorkout = async (e) => {
    e.preventDefault()
    if (!title) {
      alert('Title is required')
      return
    }
    try {
      const response = await api.post('/workouts', { title, description })
      setWorkouts([...workouts, response.data])
      setTitle('')
      setDescription('')
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteWorkout = async (id) => {
    try {
      await api.delete(`/workouts/${id}`)
      setWorkouts(workouts.filter(workout => workout.id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h1>My Workouts</h1>
      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleCreateWorkout}>
        <input
          type='text'
          placeholder='Workout title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type='text'
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type='submit'>Add Workout</button>
      </form>

      {workouts.map(workout => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onDelete={handleDeleteWorkout}
        />
      ))}
    </div>
  )
}

export default Dashboard