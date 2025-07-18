import Coupon from "../models/coupon_model.js"
import httpStatus from "http-status"

export const getCoupon = async (req, res) => {

	try {
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true })
		res.json(coupon || null)
	} catch (error) {
		console.log(`Error in get coupons ${error.message}`)
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        })
	}
}

export const validateCoupon = async (req, res) => {

	try {
		const { code } = req.body
		const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true })

		if (!coupon) {
			return res.status(httpStatus.NOT_FOUND).json({
                message: "Coupon not found"
            })
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false
			await coupon.save()
			return res.status(httpStatus.NOT_FOUND).json({
                message: "Coupon expired"
            })
		}

		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		})
	} catch (error) {
		console.log(`Error in validate coupon ${error.message}`)
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        })
	}
}