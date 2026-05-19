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

export default router