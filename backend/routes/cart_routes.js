import express from 'express'
import { addToCart,
    getCartProducts,
    removeAllFromCart,
    updateQuantity 
} from '../controllers/cart_controller.js'
import { protectRoute } from '../middlewares/auth_middleware.js'

const router = express.Router()

router.get('/', protectRoute, getCartProducts)

router.post('/', protectRoute, addToCart)

router.delete('/', protectRoute, removeAllFromCart)

router.put('/:id', protectRoute, updateQuantity)

export default router