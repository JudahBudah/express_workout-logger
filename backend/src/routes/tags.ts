import express from 'express'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// POST /workouts/:id/tags - add tag to workout
router.post('/workouts/:id/tags', authenticate, async (req, res) => {
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

  const tag = await db.tag.upsert({
    where: { name },
    update: {},
    create: { name }
  })

  await db.workoutTag.create({
    data: {
      workoutId: workout.id,
      tagId: tag.id
    }
  })

  res.status(201).json(tag)
})

// DELETE /workouts/:id/tags/:tagId - remove tag from workout
router.delete('/workouts/:id/tags/:tagId', authenticate, async (req, res) => {
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

  await db.workoutTag.delete({
    where: {
      workoutId_tagId: {
        workoutId: workout.id,
        tagId: Number(req.params.tagId)
      }
    }
  })

  res.json({ message: 'Tag removed from workout' })
})

export default router