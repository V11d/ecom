import Coupon from "../models/coupon_model"
import http_status from 'http-status'

export const get_coupon = async (req, res) => {

    try {
        const coupon = await Coupon.findOne({user_id: req.user._id, is_active: true})
        res.status(http_status.OK).json({
            success: true,
            coupon: coupon ? coupon : null
        })
    } catch (error) {
        console.log(`Error fetching coupon ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error fetching coupon',
            error: error.message
        })
    }
}

export const validate_coupon = async (req, res) => {

    const {code} = req.body
    try {
        const coupon = await Coupon.findOne({code: code, is_active: true, user_id: req.user._id})
        if (!coupon) {
            return res.status(http_status.NOT_FOUND).json({
                success: false,
                message: 'Coupon not found or inactive'
            })
        }
        // Checking for expiry date
        if (coupon.expiry_date < new Date()) {
            coupon.is_active = false
            await coupon.save()
            return res.status(http_status.BAD_REQUEST).json({
                success: false,
                message: 'Coupon has expired'
            })
        }
        res.status(http_status.OK).json({
            success: true,
            message: 'Coupon is valid',
            coupon: {
                code: coupon.code,
                discount: coupon.discount
            }
        })
    } catch (error) {
        console.log(`Error in validate coupon ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error validating coupon',
            error: error.message
        })
    }
}