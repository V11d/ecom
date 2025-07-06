import http_status from 'http-status'
import Coupon from '../models/coupon_model.js'
import { stripe } from '../lib/stripe.js'
import Order from '../models/order_model.js'

async function create_stripe_coupon(discount) {
    const coupon = await stripe.coupons.create({
        percent_off: discount,
        duration: 'once'
    })
    return coupon.id
}

async function create_new_coupon(user_id) {

    await Coupon.findOneAndDelete({ user_id })

    const new_coupon = new Coupon({
        code: 'GIFT' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discount_percentage: 10,
        expirey_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        user_id
    })
    await new_coupon.save()
    return new_coupon
}

export const create_checkout_session = async (req, res) => {

    try {
        const { products, coupon_code } = req.body
        if (!products || products.length === 0) {
            return res.status(http_status.BAD_REQUEST).json({ error: 'No products found' })
        }
        let total_amount = 0
        const line_items = products.map(product => {
            const amount = Math.round(product.price * 100)
            total_amount += amount * product.quantity
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: [product.image]
                    },
                    unit_amount: amount
                }
            }
        })
        let coupon = null
        if (coupon_code) {
            coupon = await Coupon.findOne({code: coupon_code, is_active: true})
            if (coupon) {
                total_amount -= Math.round(total_amount * (coupon.discount / 100))
            }
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            discounts: coupon ? [{
                coupon: await create_stripe_coupon(coupon.discount)
            }] : [],
            metadata: {
                user_id: req.user._id.toString(),
                coupon_code: coupon ? coupon.code : '',
                products: JSON.stringify(products.map((p) => ({
                    id: p.id,
                    name: p.name,
                    quantity: p.quantity,
                    price: p.price
                })))
            }
        })
        if (total_amount >= 20000) {
            create_new_coupon(req.user._id)
        }
        res.status(http_status.OK).json({
            success: true,
            sessionId: session.id,
            totalAmount: total_amount,
        })
    } catch (error) {
        console.log(`Error in create checkout ${error.message}`)
        return res.status(http_status.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        })
    }
}

export const checkout_status = async (req, res) => {

    try {
        const {sessionId} = req.query
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        if (session.payment_status === 'paid') {
            if (session.metadata.coupon_code) {
                await Coupon.findOneAndUpdate(
                    { code: session.metadata.coupon_code, user_id: session.metadata.user_id },
                    { is_active: false }
                )
            }
        }
        // Create new order
        const products = JSON.parse(session.metadata.products)
        const new_order = new Order({
            user: session.metadata.user_id,
            products: products.map(p => ({
                product: p.id,
                name: p.name,
                quantity: p.quantity,
                price: p.price
            })),
            total_amount: session.amount_total / 100,
            stripe_session_id: session.id,
        })
        await new_order.save()
        res.status(http_status.OK).json({
            success: true,
            order_id: new_order._id,
            message: 'Checkout successful'
        })
    } catch (error) {
        console.log(`Error in checkout status ${error.message}`)
        return res.status(http_status.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        })
    }
}