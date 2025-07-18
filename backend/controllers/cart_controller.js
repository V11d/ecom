import Product from "../models/product_model.js"
import httpStatus from "http-status"

export const getCartProducts = async (req, res) => {

	try {
		const products = await Product.find({ _id: { $in: req.user.cartItems } })

		// adding quantity for each product
		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id)
			return { ...product.toJSON(), quantity: item.quantity }
		})

		res.json(cartItems)
	} catch (error) {
		console.log(`Error in get cart products ${error.message}`)
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Server error", error: error.message
        })
	}
}

export const addToCart = async (req, res) => {

	try {
		const { productId } = req.body
		const user = req.user

		const existingItem = user.cartItems.find((item) => item.id === productId)
		if (existingItem) {
			existingItem.quantity += 1
		} else {
			user.cartItems.push(productId)
		}

		await user.save()
		res.json(user.cartItems)
	} catch (error) {
		console.log(`Error in add to cart ${error.message}`)
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        })
	}
}

export const removeAllFromCart = async (req, res) => {

	try {
		const { productId } = req.body
		const user = req.user
		if (!productId) {
			user.cartItems = []
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== productId)
		}
		await user.save()
		res.json(user.cartItems)
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        })
	}
}

export const updateQuantity = async (req, res) => {

	try {
		const { id: productId } = req.params
		const { quantity } = req.body
		const user = req.user
		const existingItem = user.cartItems.find((item) => item.id === productId)

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.id !== productId)
				await user.save()
				return res.json(user.cartItems)
			}

			existingItem.quantity = quantity
			await user.save()
			res.json(user.cartItems)
		} else {
			res.status(httpStatus.NOT_FOUND).json({
                message: "Product not found"
            })
		}
	} catch (error) {
		console.log(`Error in update quantity ${error.message}`)
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        })
	}
}