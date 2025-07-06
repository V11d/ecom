import Product from '../models/product_model.js'
import cloudinary from '../lib/cloudinary.js'
import { client } from '../lib/redis.js'
import http_status from 'http-status'

export const get_all_products = async (req, res) => {

    // On;y admin can access this route
    try {
        const products = await Product.find({})
        res.status(http_status.OK).json({
            status: 'success',
            data: {
                products
            }
        })
    } catch (error) {
        console.log(`Error getting all products ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: error.message
        })
    }
}

export const get_featured_products = async (req, res) => {

    try {
        let featured_products = await client.get('featured_products')
        if (featured_products) {
            return res.status(http_status.OK).json({
                status: 'success',
                data: {
                    products: JSON.parse(featured_products)
                }
            })
        }
        featured_products = await Product.find({is_featured: true}).lean()
        if (!featured_products) {
            return res.status(http_status.NOT_FOUND).json({
                status: 'error',
                message: 'No featured products found'
            })
        }
        await client.set('featured_products', JSON.stringify(featured_products))
        res.status(http_status.OK).json({
            status: 'success',
            data: {
                products: featured_products
            }
        })
    } catch (error) {
        console.log(`Error getting featured products ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: error.message
        })
    }
}

export const create_product = async (req, res) => {

    const {name, description, price, image, category} = req.body
    try {
        let cloudinary_res = null
        if (image) {
            cloudinary_res = await cloudinary.uploader.upload(image, {
                folder: 'products',
            })
        }
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinary_res?.secure_url || '',
            category
        })
        res.status(http_status.CREATED).json({
            status: 'success',
            data: {
                product
            }
        })
    } catch (error) {
        console.log(`Error creating product ${error.message}`);
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: error.message
        })
    }
}

export const delete_product = async (req, res) => {

    const {id} = req.params
    try {
        const product = await Product.findById(id)
        if (!product) {
            return res.status(http_status.NOT_FOUND).json({
                status: 'error',
                message: 'Product not found'
            })
        }
        if (product.image) {
            const public_id = product.image.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(`products/${public_id}`)
        }
        await Product.findByIdAndDelete(id)
    } catch (error) {
        console.log(`Error deleting product ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: error.message
        })
    }
}

export const recommedned_products = async (req, res) => {

    try {
        const product = await Product.aggregate([
            {$sample: {size: 3}},
            {$project: {
                _id: 1,
                name: 1,
                description: 1,
                price: 1,
                image: 1,
                category: 1
            }}
        ])
        res.status(http_status.OK).json({
            status: 'success',
            data: {
                products: product
            }
        })
    } catch (error) {
        console.log(`Error getting recommended products ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: error.message
        })
    }
}

export const get_product_by_category = async (req, res) => {

    const {category} = req.params
    try {
        const products = await Product.find({category})
        if (!products) {
            return res.status(http_status.NOT_FOUND).json({
                status: 'error',
                message: 'No products found in this category'
            })
        }
        res.status(http_status.OK).json({
            status: 'success',
            data: {
                products
            }
        })
    } catch (error) {
        console.log(`Error getting products by category ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: error.message
        })
    }
}

export const toggle_featured_products = async (req, res) => {

    const {id} = req.params
    try {
        const product = await Product.findById(id)
        if (product) {
            product.is_featured = !product.is_featured
            await product.save()
            // Cache the updated featured products
            const featured_products = await Product.find({is_featured: true}).lean()
            await client.set('featured_products', JSON.stringify(featured_products))
            res.status(http_status.OK).json({
                status: 'success',
                data: {
                    product
                }
            })
        } else {
            return res.status(http_status.NOT_FOUND).json({
                status: 'error',
                message: 'Product not found'
            })
        }
    } catch (error) {
        console.log(`Error toggling featured product ${error.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: error.message
        })
    }
}