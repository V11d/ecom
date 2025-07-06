import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import auth_routes from './routes/auth_routes.js'
import connect_to_db from './lib/db.js'
import product_routes from './routes/product_routes.js'
import cart_routes from './routes/cart_routes.js'
import coupon_routes from './routes/coupon_routes.js'
import payment_routes from './routes/payment_routes.js'
import analytics_route from './routes/analytics_route.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', auth_routes)
app.use('/api/products', product_routes)
app.use('/api/cart', cart_routes)
app.use('/api/coupons', coupon_routes)
app.use('/api/payments', payment_routes)
app.use('/api/analytics', analytics_route)

app.listen(port, () => {

  console.log(`Server is running on port ${port}`)
  connect_to_db()
})