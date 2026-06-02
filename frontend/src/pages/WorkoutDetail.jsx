import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Header from '../components/Header'

function WorkoutDetail() {
  const [workout, setWorkout] = useState(null)
  const [exerciseName, setExerciseName] = useState('')
  const [setInputs, setSetInputs] = useState({})
  const [tagName, setTagName] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/workouts/${id}`)
      .then(response => setWorkout(response.data))
      .catch(() => navigate('/dashboard'))
  }, [id])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  // Exercise handlers
  const handleAddExercise = async (e) => {
    e.preventDefault()
    if (!exerciseName) {
      alert('Exercise name is required');
      return
    }
    try {
      const response = await api.post(`/workouts/${id}/exercises`, { name: exerciseName })
      setWorkout({
        ...workout,
        exercises: [...workout.exercises, response.data]
      })
      setExerciseName('')
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await api.delete(`/exercises/${exerciseId}`)
      setWorkout({
        ...workout,
        exercises: workout.exercises.filter(ex => ex.id !== exerciseId)
      })
    } catch (err) {
      console.log(err)
    }
  }


  // Set handlers
  const handleAddSet = async (e, exerciseId) => {
    e.preventDefault()
    const input = setInputs[exerciseId] || {}
    try {
      const response = await api.post(`/exercises/${exerciseId}/sets`, {
        setNumber: Number(input.setNumber) || 1,
        reps: Number(input.reps) || null,
        weight: Number(input.weight) || null,
        time: Number(input.time) || null
      })
      setWorkout({
        ...workout,
        exercises: workout.exercises.map(ex =>
          ex.id === exerciseId
            ? { ...ex, sets: [...ex.sets, response.data] }
            : ex
        )
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteSet = async (exerciseId, setId) => {
    try {
      await api.delete(`/sets/${setId}`)
      setWorkout({
        ...workout,
        exercises: workout.exercises.map(ex =>
          ex.id === exerciseId
            ? { ...ex, sets: ex.sets.filter(s => s.id !== setId) }
            : ex
        )
      })
    } catch (err) {
      console.log(err)
    }
  }


  // Tag handlers
  const handleAddTag = async (e) => {
    e.preventDefault()
    if (!tagName) return
    try {
      const response = await api.post(`/workouts/${id}/tags`, { name: tagName })
      setWorkout({
        ...workout,
        workoutTags: [...workout.workoutTags, { tag: response.data, tagId: response.data.id, workoutId: Number(id) }]
      })
      setTagName('')
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteTag = async (tagId) => {
    try {
      await api.delete(`/workouts/${id}/tags/${tagId}`)
      setWorkout({
        ...workout,
        workoutTags: workout.workoutTags.filter(wt => wt.tagId !== tagId)
      })
    } catch (err) {
      console.log(err)
    }
  }

  if (!workout) return <p>Loading...</p>

  return (
    <div className='bg-zinc-900 min-h-screen text-white px-20 pt-19'>
      <Header onLogout={handleLogout} />

      <button onClick={() => navigate('/dashboard')} className='bg-orange-500 px-3 rounded-md cursor-pointer'>Back</button>

      <div className='my-6 bg-zinc-700/50 p-6 rounded-md'>
        <h1 className='font-bold text-3xl'>{workout.title}</h1>
        <p className='text-gray-400'>{workout.description}</p>

        {/* Tags */}
        <div className='flex items-center gap-2 mt-4'>
          {workout.workoutTags.map(wt => (
            <div key={wt.tagId}>
              <p className='bg-orange-500/20 rounded-md text-center p-1 px-2'>{wt.tag.name}
              </p>

              <button onClick={() => handleDeleteTag(wt.tagId)} 
              className='hidden bg-red-500 p-1 px-2 rounded-md cursor-pointer items-center ml-auto mt-2.5'>Remove
              </button>
            </div>
          ))}

          <form onSubmit={handleAddTag} className='flex gap-2'>
            <input
              type='text'
              placeholder='Tag name'
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className='bg-zinc-700 p-1 pl-2 w-20 rounded-md outline-0 text-[0.9rem]'
            />
            <button type='submit' className='bg-orange-500 px-3 rounded-md cursor-pointer'>Add Tag</button>
          </form>
        </div>
      </div>

      {/* Exercises */}
      <h2>Exercises</h2>
      <form onSubmit={handleAddExercise}>
        <input
          type='text'
          placeholder='Exercise name'
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />
        <button type='submit'>Add Exercise</button>
      </form>

      {/* Sets */}
      {workout.exercises.map(exercise => (
        <div key={exercise.id}>
          <h3>{exercise.name}</h3>
          <button onClick={() => handleDeleteExercise(exercise.id)}>Delete Exercise</button>

          <form onSubmit={(e) => handleAddSet(e, exercise.id)}>
            <input
              type='number'
              placeholder='Set number'
              value={setInputs[exercise.id]?.setNumber || ''}
              onChange={(e) => setSetInputs({ ...setInputs, [exercise.id]: { ...setInputs[exercise.id], setNumber: e.target.value }})}
            />
            <input
              type='number'
              placeholder='Reps'
              value={setInputs[exercise.id]?.reps || ''}
              onChange={(e) => setSetInputs({ ...setInputs, [exercise.id]: { ...setInputs[exercise.id], reps: e.target.value }})}
            />
            <input
              type='number'
              placeholder='Weight'
              value={setInputs[exercise.id]?.weight || ''}
              onChange={(e) => setSetInputs({ ...setInputs, [exercise.id]: { ...setInputs[exercise.id], weight: e.target.value }})}
            />
            <input
              type='number'
              placeholder='Time'
              value={setInputs[exercise.id]?.time || ''}
              onChange={(e) => setSetInputs({ ...setInputs, [exercise.id]: { ...setInputs[exercise.id], time: e.target.value }})}
            />
            <button type='submit'>Add Set</button>
          </form>

          {exercise.sets.map(set => (
            <div key={set.id}>
              <p>Set {set.setNumber} — Reps: {set.reps} Weight: {set.weight} Time: {set.time}</p>
              <button onClick={() => handleDeleteSet(exercise.id, set.id)}>Delete Set</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default WorkoutDetail