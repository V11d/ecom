import express from 'express'
import { add_to_cart,
    get_all_cart_products,
    remove_all_from_cart,
    update_quantity 
} from '../controllers/cart_controller.js'
import { protect_route } from '../middlewares/auth_middleware.js'

const router = express.Router()

router.get('/', protect_route, get_all_cart_products)

router.post('/', protect_route, add_to_cart)

router.delete('/', protect_route, remove_all_from_cart)

router.put('/:id', protect_route, update_quantity)

export default router