import express from 'express'
import http_status from 'http-status'
import { admin_route, protect_route } from '../middlewares/auth_middleware.js'
import { get_analytics, get_daily_sales_data } from '../controllers/analytics_controller.js'

const router = express.Router()

router.get('/', protect_route, admin_route, async (req, res) => {

    try {
        const analytics_data = await get_analytics()
        // Chart data
        const end_date = new Date()
        const start_date = new Date(end_date.getTime() - 7 * 24 * 60 * 60 * 1000)
        const daily_sales_data = await get_daily_sales_data(start_date, end_date)

        res.json({
            analytics_data,
            daily_sales_data
        })
    } catch (error) {
        // Something went wrong
        console.log(`Error in analytics route ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            message: 'Error fetching analytics data'
        })
    }
})

export default router