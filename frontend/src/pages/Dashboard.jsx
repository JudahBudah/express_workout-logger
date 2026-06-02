import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import WorkoutCard from '../components/WorkoutCard'
import Header from '../components/Header'

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
    <div className='bg-zinc-900 min-h-screen text-white'>
      <Header onLogout={handleLogout} />

      <div className='max-w-6xl mx-auto px-8 pt-28'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-black text-white'>My Workouts</h1>
            <p className='text-zinc-500 text-sm mt-1'>{workouts.length} workouts logged</p>
          </div>
        </div>

        <form onSubmit={handleCreateWorkout} className='rounded-2xl my-5 mb-8 flex gap-3'>
          <input
            type='text'
            placeholder='Workout title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='flex-1 bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-500 transition-colors'
          />
          <input
            type='text'
            placeholder='Description (optional)'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='flex-1 bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-500 transition-colors'
          />
          <button
            type='submit'
            className='bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer'
          >
            Add Workout
          </button>
        </form>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {workouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onDelete={handleDeleteWorkout}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard