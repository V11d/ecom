import http_status from 'http-status'
import Product from '../models/product_model.js'

export const get_all_cart_products = async (req, res) => {

    try {
        const products = await Product.find({_id: {$in: req.user.cart_items}})
        const cart_items = products.map(product => {
            const item = req.user.cart_items.find((cart_item) => cart_item.id === product.id)
            return {...product.toJSON(), quantity: item.quantity}
        })
        res.status(http_status.OK).json({
            status: 'success',
            message: 'Cart items retrieved successfully',
            data: cart_items
        })
    } catch (error) {
        console.log(`Error retrieving cart items: ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to retrieve cart items',
            error: error.message
        })
    }
}

export const add_to_cart = async (req, res) => {

    const user = req.user
    const {product_id} = req.body
    try {
        const existing_item = user.cart_items.find(item => item.product_id === product_id)
        if (existing_item) {
            existing_item.quantity += 1
        } else {
            user.cart_items.push({ product_id, quantity: 1 })
        }
        await user.save()
        res.status(http_status.OK).json({
            status: 'success',
            message: 'Cart updated successfully',
            data: user.cart_items
        })
    } catch (error) {
        console.log(`Error updating cart ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to update cart',
            error: error.message
        })
    }
}

export const remove_all_from_cart = async (req, res) => {

    try {
        const user = req.user
        const {product_id} = req.body
        if (!product_id) {
            user.cart_items = []
        } else {
            user.cart_items = user.cart_items.filter(item => item.product_id !== product_id)
        }
        await user.save()
        res.status(http_status.OK).json({
            status: 'success',
            message: 'Cart cleared successfully',
            data: user.cart_items
        })
    } catch (error) {
        console.log(`Error clearing cart ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to clear cart',
            error: error.message
        })
    }
}

export const update_quantity = async (req, res) => {

    try {
        const {id} = req.params
        const {quantity} = req.body
        const user = req.user
        const existing_item = user.cart_items.find(item => item.product_id === id)
        if (existing_item) {
            if (quantity === 0) {
                user.cart_items = user.cart_items.filter(item => item.product_id !== id)
                await user.save()
                return res.status(http_status.OK).json({
                    status: 'success',
                    message: 'Item removed from cart',
                    data: user.cart_items
                })
            }
            existing_item.quantity = quantity
            await user.save()
            return res.status(http_status.OK).json({
                status: 'success',
                message: 'Cart updated successfully',
                data: user.cart_items
            })
        } else {
            return res.status(http_status.NOT_FOUND).json({
                status: 'error',
                message: 'Item not found in cart'
            })
        }
    } catch (error) {
        console.log(`Error updating quantity ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to update quantity',
            error: error.message
        })
    }
}