import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { connectDB } from '../dbConnection.js'

const router = express.Router()
const SALT_ROUNDS = 10

dotenv.config()

function createToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  })
}

async function hashPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS)
  return hash
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

router.post('/register', async (req, res) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const existing = await users.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'User with this email already exists' })
    }

    const hashedPassword = await hashPassword(password)
    const result = await users.insertOne({
      name,
      email,
      role: 'user',
      password: hashedPassword,
      createdAt: new Date()
    })

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertedId
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to register user', error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' })
    }

    const user = await users.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = createToken(user)

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to login', error: err.message })
  }
})

export default router