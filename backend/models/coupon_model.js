import mongoose from "mongoose"

const coupon_schema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    is_active: {
        type: Boolean,
        default: true
    },
    expiry_date: {
        type: Date,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }
}, {timestamps: true})

const Coupon = mongoose.model('Coupon', coupon_schema)

export default Coupon