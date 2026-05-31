import { useNavigate } from 'react-router-dom'

function WorkoutCard({ workout, onDelete }) {
    const navigate = useNavigate()

  return (
    <div>
      <h2 onClick={() => navigate(`/workouts/${workout.id}`)} style={{ cursor: 'pointer' }}>{workout.title}</h2>
      <p>{workout.description}</p>
      <button onClick={() => onDelete(workout.id)}>Delete</button>
    </div>
  )
}

export default WorkoutCard