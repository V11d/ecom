import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const user_schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    cart_items: [{
        quantity: {
            type: Number,
            default: 1
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    }],
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    }
}, {timestamps: true})

// Hash password before saving
user_schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

// Method to compare password
user_schema.methods.compare_password = async function (password) {

    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', user_schema)

export default User