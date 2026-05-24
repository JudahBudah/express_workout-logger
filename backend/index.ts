import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './src/routes/auth.js'
import workoutRoutes from './src/routes/workouts.js'
import exerciseRoutes from './src/routes/exercises.js'
import tagRoutes from './src/routes/tags.js'


dotenv.config()

const app = express()

app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/workouts', workoutRoutes)
app.use('/', exerciseRoutes)
app.use('/', tagRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})