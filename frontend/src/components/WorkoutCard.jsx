import { useNavigate } from 'react-router-dom'

function WorkoutCard({ workout, onDelete }) {
  const navigate = useNavigate()

  return (
    <div className='bg-zinc-800 border border-zinc-700 rounded-2xl p-5 flex flex-col gap-3 hover:border-orange-500/50 transition-colors cursor-pointer group'>
      <div onClick={() => navigate(`/workouts/${workout.id}`)}>
        <h2 className='font-bold text-lg text-white group-hover:text-orange-400 transition-colors'>{workout.title}</h2>
        <p className='text-zinc-500 text-sm mt-1'>{workout.description || 'No description'}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(workout.id)
        }}
        className='mt-auto self-end text-xs text-zinc-600 hover:text-red-400 font-medium transition-colors'
      >
        Delete
      </button>
    </div>
  )
}

export default WorkoutCard