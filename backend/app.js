import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth_routes.js'
import { connectDB } from './lib/db.js'
import productRoutes from './routes/product_routes.js'
import cartRoutes from './routes/cart_routes.js'
import couponRoutes from './routes/coupon_routes.js'
import paymentRoutes from './routes/payment_routes.js'
import analyticsRoutes from './routes/analytics_route.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)

app.listen(port, () => {

  console.log(`Server is running on port ${port}`)
  connectDB()
})