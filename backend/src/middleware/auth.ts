import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number }
    req.user = { id: decoded.userId }
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}