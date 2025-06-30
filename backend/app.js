import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import auth_routes from './routes/auth_routes.js'
import connect_to_db from './lib/db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', auth_routes)

app.listen(port, () => {

  console.log(`Server is running on port ${port}`)
  connect_to_db()
})