import express from 'express'
import { login, logout, refresh_access_token, signup, user_profile } from '../controllers/auth_controller.js'

const router = express.Router()

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.post('/refresh-token', refresh_access_token)

router.get('/profile', user_profile)

export default router