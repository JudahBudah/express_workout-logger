import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Header from '../components/Header'
import { FaPlus } from 'react-icons/fa6'
import { LiaTimesSolid } from 'react-icons/lia'
import { FaTag } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa'

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
        exercises: [...workout.exercises, { ...response.data, sets: [] }]
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
    <div className='bg-zinc-900 min-h-screen text-white p-20'>
      <Header onLogout={handleLogout} />

      <button onClick={() => navigate('/dashboard')} className='bg-orange-500 px-3 rounded-md cursor-pointer'>Back</button>

      <div className='bg-zinc-800 border border-zinc-700 rounded-2xl p-6 my-6'>
        <h1 className='font-bold text-3xl'>{workout.title}</h1>
        <p className='text-gray-400'>{workout.description}</p>

        {/* Tags */}
        <div className='flex flex-wrap items-center gap-2 mt-4'>
          {workout.workoutTags.map(wt => (
            <div key={wt.tagId} className='group relative'>
              <p className='group-hover:invisible bg-orange-500/20 rounded-md text-center py-1 px-2 '>{wt.tag.name}
              </p>

              <button onClick={() => handleDeleteTag(wt.tagId)} 
              className='group-hover:flex hidden absolute inset-0 bg-red-500/30 rounded-md justify-center items-center cursor-pointer'><LiaTimesSolid />
              </button>
            </div>
          ))}

          <form onSubmit={handleAddTag} className='flex items-center bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden focus-within:border-orange-500 transition-colors'>
            <FaTag className='text-zinc-500 ml-3 shrink-0' size={13} />
            <input
              type='text'
              placeholder='Tag name'
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className='bg-transparent text-white text-sm px-2.5 py-2.5 outline-none w-36 placeholder:text-zinc-500'
            />
            <button
              type='submit'
              className='flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3.5 h-full py-2.5 transition-colors cursor-pointer shrink-0'>
              <FaPlus size={11} />
              Add tag
            </button>
          </form>
        </div>
      </div>

      {/* Exercises */}
      <h2 className='font-bold text-3xl mb-3'>Exercises</h2>
      <form onSubmit={handleAddExercise} className='flex gap-3 mb-5'>
        <input
          type='text'
          placeholder='Exercise name'
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          className='bg-zinc-900 border border-zinc-700 text-white rounded-lg w-60 px-4 py-2.5 text-sm outline-none focus:border-orange-500 transition-colors'
        />
        <button type='submit' className='bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer'>Add Exercise</button>
      </form>

      {/* Sets */}
      {workout.exercises.map(exercise => (
        <div key={exercise.id} className='mb-8'>

          {/* Exercise header */}
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-xl font-bold text-white'>{exercise.name}</h3>
            <button
              onClick={() => handleDeleteExercise(exercise.id)}
              className='text-zinc-500 hover:text-red-400 text-sm transition-colors cursor-pointer'
            >
              Remove
            </button>
          </div>

          {/* Add set form */}
          <form onSubmit={(e) => handleAddSet(e, exercise.id)} className='flex gap-2 mb-4 flex-wrap'>
            {[
              { key: 'setNumber', placeholder: 'Set #' },
              { key: 'reps',      placeholder: 'Reps'  },
              { key: 'weight',    placeholder: 'Weight' },
              { key: 'time',      placeholder: 'Time'   },
            ].map(({ key, placeholder }) => (
              <input
                key={key}
                type='number'
                placeholder={placeholder}
                value={setInputs[exercise.id]?.[key] || ''}
                onChange={(e) => setSetInputs({
                  ...setInputs,
                  [exercise.id]: { ...setInputs[exercise.id], [key]: e.target.value }
                })}
                className='min-w-40 flex-1 bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500 transition-colors'
              />
            ))}
            <button
              type='submit'
              className='bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap cursor-pointer'
            >
              Add Set
            </button>
          </form>

          {/* Sets list */}
          {exercise.sets.length > 0 && (
            <div className='flex flex-col gap-1'>
              {exercise.sets.map(set => (
                <div key={set.id} className='flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5'>
                  <span className='text-sm text-zinc-300'>
                    <span className='text-white font-medium'>Set {set.setNumber}</span>
                    <span className='text-zinc-600 mx-2'>·</span>
                    {set.reps} reps
                    <span className='text-zinc-600 mx-2'>·</span>
                    {set.weight} kg
                    <span className='text-zinc-600 mx-2'>·</span>
                    {set.time}s
                  </span>
                  <button
                    onClick={() => handleDeleteSet(exercise.id, set.id)}
                    className='text-zinc-600 hover:text-red-400 text-sm transition-colors cursor-pointer'
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      ))}
    </div>
  )
}

export default WorkoutDetail