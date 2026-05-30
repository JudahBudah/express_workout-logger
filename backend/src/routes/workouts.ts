import express from 'express'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// GET /workouts - get all workouts for logged in user
router.get('/', authenticate, async (req, res) => {
  const workouts = await db.workout.findMany({
    where: { userId: req.user!.id },
    include: {
      exercises: true,
      workoutTags: {
        include: { tag: true }
      }
    }
  })

  res.json(workouts)
})

// GET /workouts/:id - get single workout
router.get('/:id', authenticate, async (req, res) => {
  const workout = await db.workout.findFirst({
    where: {
      id: Number(req.params.id),
      userId: req.user!.id
    },
    include: {
      exercises: {
        include: { sets: true }
      },
      workoutTags: {
        include: { tag: true }
      }
    }
  })

  if (!workout) {
    res.status(404).json({ message: 'Workout not found' })
    return
  }

  res.json(workout)
})

// POST /workouts - create workout
router.post('/', authenticate, async (req, res) => {
  const { title, description } = req.body

  if (!title) {
    res.status(400).json({ message: 'Title is required' })
    return
  }

  const workout = await db.workout.create({
    data: {
      title,
      description,
      userId: req.user!.id
    }
  })

  res.status(201).json(workout)
})

// DELETE /workouts/:id - delete workout
router.delete('/:id', authenticate, async (req, res) => {
  const workout = await db.workout.findFirst({
    where: {
      id: Number(req.params.id),
      userId: req.user!.id
    }
  })

  if (!workout) {
    res.status(404).json({ message: 'Workout not found' })
    return
  }

  await db.workout.delete({
    where: { id: Number(req.params.id) }
  })

  res.json({ message: 'Workout deleted' })
})


export default router