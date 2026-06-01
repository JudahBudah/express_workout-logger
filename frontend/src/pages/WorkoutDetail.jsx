import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

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
    <>
      <button onClick={() => navigate('/dashboard')}>Back</button>
      <h1>{workout.title}</h1>
      <p>{workout.description}</p>

      {/* Tags */}
      <h2>Tags</h2>
      <form onSubmit={handleAddTag}>
        <input
          type='text'
          placeholder='Tag name'
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
        <button type='submit'>Add Tag</button>
      </form>

      {workout.workoutTags.map(wt => (
        <div key={wt.tagId}>
          <p>{wt.tag.name}</p>
          <button onClick={() => handleDeleteTag(wt.tagId)}>Remove</button>
        </div>
      ))}

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
    </>
  )
}

export default WorkoutDetail