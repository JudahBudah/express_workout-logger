import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function WorkoutDetail() {
  const [workout, setWorkout] = useState(null)
  const [exerciseName, setExerciseName] = useState('')
  const [setInputs, setSetInputs] = useState({})
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/workouts/${id}`)
      .then(response => setWorkout(response.data))
      .catch(() => navigate('/dashboard'))
  }, [id])


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
  const handleAddSet = async (exerciseId) => {
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

  if (!workout) return <p>Loading...</p>

  return (
    <div>
      <button onClick={() => navigate('/dashboard')}>Back</button>
      <h1>{workout.title}</h1>
      <p>{workout.description}</p>

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

      {workout.exercises.map(exercise => (
        <div key={exercise.id}>
          <h3>{exercise.name}</h3>
          <button onClick={() => handleDeleteExercise(exercise.id)}>Delete Exercise</button>

          <div>
            <input
              type='number'
              placeholder='Set number'
              onChange={(e) => setSetInputs({ ...setInputs, [exercise.id]: { ...setInputs[exercise.id], setNumber: e.target.value }})}
            />
            <input
              type='number'
              placeholder='Reps'
              onChange={(e) => setSetInputs({ ...setInputs, [exercise.id]: { ...setInputs[exercise.id], reps: e.target.value }})}
            />
            <input
              type='number'
              placeholder='Weight'
              onChange={(e) => setSetInputs({ ...setInputs, [exercise.id]: { ...setInputs[exercise.id], weight: e.target.value }})}
            />
            <input
              type='number'
              placeholder='Time'
              onChange={(e) => setSetInputs({ ...setInputs, [exercise.id]: { ...setInputs[exercise.id], time: e.target.value }})}
            />
            <button onClick={() => handleAddSet(exercise.id)}>Add Set</button>
          </div>

          {exercise.sets.map(set => (
            <div key={set.id}>
              <p>Set {set.setNumber} — Reps: {set.reps} Weight: {set.weight} Time: {set.time}</p>
              <button onClick={() => handleDeleteSet(exercise.id, set.id)}>Delete Set</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )}

export default WorkoutDetail