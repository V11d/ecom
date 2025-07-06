import http_status from 'http-status'
import User from '../models/user_model.js'
import Product from '../models/product_model.js'
import Order from '../models/order_model.js'

export const get_analytics = async () => {

    const total_users = await User.countDocuments({})
    const total_products = await Product.countDocuments({})
    const sales_data = await Order.aggregate([
        {
            $group: {
                _id: null,
                total_sales: { $sum: 1 },
                total_revenue: { $sum: '$total_price' }
            }
        }
    ])
    const {total_sales, total_revenue} = sales_data[0] || { total_sales: 0, total_revenue: 0 }

    return {
        users: total_users,
        products: total_products,
        total_sales,
        total_revenue
    }
}

export const get_daily_sales_data = async (start_date, end_date) => {

    const daily_sales_data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: start_date,
                    $lte: end_date
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total_sales: { $sum: 1 },
                total_revenue: { $sum: "$total_price" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])

    const date_array = get_dates_in_range(start_date, end_date)

    return date_array.map(date => {
        const found_data = daily_sales_data.find(item => item._id === date)
        return {
            date,
            sales: found_data?.total_sales || 0,
            revenue: found_data?.total_revenue || 0
        }
    })
}

function get_dates_in_range(start_date, end_date) {

    const dates = []
    let current_date = new Date(start_date)
    while (current_date <= end_date) {
        dates.push(current_date.toISOString().split('T')[0])
        current_date.setDate(current_date.getDate() + 1)
    }
    return dates
}