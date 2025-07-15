import express from 'express'
import { login,
    logout,
    signup,
    getProfile, 
    refreshToken
} from '../controllers/auth_controller.js'
import { protectRoute } from '../middlewares/auth_middleware.js'

const router = express.Router()

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.post('/refresh-token', refreshToken)

router.get('/profile', protectRoute, getProfile)

export default router