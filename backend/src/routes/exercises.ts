import express from 'express'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// POST /workouts/:id/exercises - add exercise to workout
router.post('/workouts/:id/exercises', authenticate, async (req, res) => {
  const { name } = req.body

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

  const exercise = await db.exercise.create({
    data: {
      name,
      workoutId: workout.id
    }
  })

  res.status(201).json(exercise)
})

// DELETE /exercises/:id - delete exercise
router.delete('/exercises/:id', authenticate, async (req, res) => {
  const exercise = await db.exercise.findFirst({
    where: {
      id: Number(req.params.id),
      workout: { userId: req.user!.id }
    }
  })

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' })
    return
  }

  await db.exercise.delete({
    where: { id: Number(req.params.id) }
  })

  res.json({ message: 'Exercise deleted' })
})

export default router


// POST /exercises/:id/sets - add set to exercise
router.post('/exercises/:id/sets', authenticate, async (req, res) => {
  const { setNumber, reps, weight, time } = req.body

  const exercise = await db.exercise.findFirst({
    where: {
      id: Number(req.params.id),
      workout: { userId: req.user!.id }
    }
  })

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' })
    return
  }

  const set = await db.exerciseSet.create({
    data: {
      setNumber,
      reps,
      weight,
      time,
      exerciseId: exercise.id
    }
  })

  res.status(201).json(set)
})

// DELETE /exercises/:id/sets - delete all sets from exercise
router.delete('/exercises/:id/sets', authenticate, async (req, res) => {
  const exercise = await db.exercise.findFirst({
    where: {
      id: Number(req.params.id),
      workout: { userId: req.user!.id }
    }
  })

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' })
    return
  }

  await db.exerciseSet.deleteMany({
    where: { exerciseId: exercise.id }
  })

  res.json({ message: 'Sets deleted' })
})