import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.user.create({
    data: {
      username,
      email,
      passwordHash: hashedPassword
    }
  })

  res.status(201).json({ message: 'User created', userId: user.id })
})


router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await db.user.findUnique({
    where: { email }
  })

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatch) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  )

  res.json({ token })
})


export default router