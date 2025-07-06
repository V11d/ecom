import jwt from 'jsonwebtoken'
import User from '../models/user_model.js'
import http_status from 'http-status'

export const protect_route = async (req, res, next) => {

    try {
        const access_token = req.cookies.access_token || req.headers.authorization?.split(' ')[1]
        if (!access_token) {
            return res.status(http_status.UNAUTHORIZED).json({
                message: 'Unauthorized access, no token provided'
            })
        }
        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        if (!user) {
            return res.status(http_status.UNAUTHORIZED).json({
                message: 'User does not exist'
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.log(`Error in protect_route middleware ${error.message}`)
        return res.status(http_status.UNAUTHORIZED).json({
            message: 'Unauthorized access, invalid token'
        })
    }
}

export const admin_route = (req, res, next) => {

    if (req.user && req.user.role === 'admin') {
        return next()
    }
    return res.status(http_status.FORBIDDEN).json({
        message: 'Access denied, admin only'
    })
}