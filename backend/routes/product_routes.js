import express from 'express'
import { create_product,
    delete_product,
    get_all_products,
    get_featured_products,
    get_product_by_category,
    recommedned_products,
    toggle_featured_products
} from '../controllers/product_controller.js'
import { admin_route, protect_route } from '../middlewares/auth_middleware.js'

const router = express.Router()

router.get('/', protect_route, admin_route, get_all_products)

router.get('/featured', get_featured_products)

router.get('/recommended', recommedned_products)

router.get('/category/:category', get_product_by_category)

router.post('/', protect_route, admin_route, create_product)

router.patch('/:id', protect_route, admin_route, toggle_featured_products)

router.delete('/:id', protect_route, admin_route, delete_product)

export default router