import mongoose from "mongoose"

const product_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    is_featured: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Product = mongoose.model('Product', product_schema)

export default Product