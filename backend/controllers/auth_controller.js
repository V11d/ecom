import http_status from 'http-status'
import User from '../models/user_model.js'
import { client } from '../lib/redis.js'
import jwt from 'jsonwebtoken'

const generate_token = (user_id) => {

    const access_token = jwt.sign(
        {user_id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '15m'}
    )

    const refresh_token = jwt.sign(
        {user_id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '7d'}
    )

    return {access_token, refresh_token}
}

const store_refresh_token = async (user_id, refresh_token) => {

    await client.set(`refresh_token:${user_id}`, refresh_token, 'EX', 7 * 24 * 60 * 60)
}

const set_cookie = (res, access_token, refresh_token) => {

    res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
        sameSite: 'strict'
    })

    res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict'
    })
}

// Routes
export const signup = async (req, res) => {

    const {username, email, password} = req.body
    try {
        if (!username || !email || !password) {
            return res.status(http_status.BAD_REQUEST).json({
                message: 'All fields are required'
            })
        }
        const existing_user = await User.findOne(({email}))
        if (existing_user) {
            return res.status(http_status.BAD_REQUEST).json({
                message: 'User with this email already exists'
            })
        }
        const user = await User.create({
            username,
            email,
            password
        })
        // Generate a token
        const {access_token, refresh_token} = generate_token(user._id)
        await store_refresh_token(user._id, refresh_token)
        // Set the cookies
        set_cookie(res, access_token, refresh_token)
        // Saving the user to the database
        await user.save()
        res.status(http_status.CREATED).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined, // Exclude password from the response
            },
            message: 'User created successfully',
        })
    } catch (error) {
        console.log(`Error during signup ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const login = async (req, res) => {

    const {email, password} = req.body
    try {
        if (!email || !password) {
            return res.status(http_status.BAD_REQUEST).json({
                message: 'All fields are required'
            })
        }
        const user = await User.findOne({email})
        if (user && await user.compare_password(password)) {
            // Generate the token
            const {access_token, refresh_token} = generate_token(user._id)
            await store_refresh_token(user._id, refresh_token)
            // Set the cookies
            set_cookie(res, access_token, refresh_token)
            res.status(http_status.OK).json({
                success: true,
                user: {
                    ...user._doc,
                    password: undefined,
                },
                message: 'Login successful'
            })
        } else {
            return res.status(http_status.UNAUTHORIZED).json({
                message: 'Invalid email or password'
            })
        }
    } catch (error) {
        console.log(`Error during login ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const logout = async (req, res) => {

    try {
        const refresh_token = req.cookies.refresh_token
        if (refresh_token) {
            const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
            await client.del(`refresh_token:${decoded.user_id}`)
        }
        // Clearing cookies
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')
        res.status(http_status.OK).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.log(`Error during logout ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// To refresh the access token
export const refresh_access_token = async (req, res) => {

    try {
        const refresh_token = req.cookies.refresh_token
        if (!refresh_token) {
            return res.status(http_status.UNAUTHORIZED).json({
                message: 'No refresh token provided'
            })
        }
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
        const stored_refresh_token = await client.get(`refresh_token:${decoded.user_id}`)
        if (!stored_refresh_token || stored_refresh_token !== refresh_token) {
            return res.status(http_status.UNAUTHORIZED).json({
                message: 'Invalid refresh token'
            })
        }
        // Generate a new access token
        const access_token = jwt.sign(
            {user_id: decoded.user_id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '15m'}
        )

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
            sameSite: 'strict'
        })
        res.status(http_status.OK).json({
            success: true,
            access_token,
            message: 'Access token refreshed successfully'
        })
    } catch (error) {
        console.log(`Error during access token refresh ${error.message}`)
        return res.status(http_status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const user_profile = async (req, res) => {

    // TODO
}