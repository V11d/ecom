import mongoose from "mongoose"

const order_schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    total_price: {
        type: Number,
        required: true,
        min: 0
    },
    stripe_session_id: {
        type: String,
        unique: true
    }
}, {timestamps: true})

const Order = mongoose.model('Order', order_schema)

export default Order