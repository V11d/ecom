import express from 'express'
import { protect_route } from '../middlewares/auth_middleware.js'
import { get_coupon, validate_coupon } from '../controllers/coupon_controller.js'

const router = express.Router()

router.get('/', protect_route, get_coupon)

router.get('/validate', protect_route, validate_coupon)

export default router