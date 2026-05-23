import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './src/routes/auth.js'
import workoutRoutes from './src/routes/workouts.js'


dotenv.config()

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)

app.use('/workouts', workoutRoutes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})