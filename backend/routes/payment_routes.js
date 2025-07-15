import express from 'express'
import { protectRoute } from '../middlewares/auth_middleware.js'
import { checkoutSuccess, createCheckoutSession } from '../controllers/payment_controller.js'

const router = express.Router()

router.post('/create-checkout-session', protectRoute, createCheckoutSession)

router.post('/checkout-status', protectRoute, checkoutSuccess)

export default router