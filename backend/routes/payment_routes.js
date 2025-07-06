import express from 'express'
import { protect_route } from '../middleware/auth_middleware.js'
import { checkout_status, create_checkout_session } from '../controllers/payment_controller.js'

const router = express.Router()

router.post('/create-checkout-session', protect_route, create_checkout_session)

router.post('/checkout-status', protect_route, checkout_status)

export default router