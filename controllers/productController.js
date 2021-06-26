const Products = require('../models/productModel')

//Filter, Sort, Pagination
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filtering() {
        const queryObj = { ...this.queryString } //queryString  = req.query

        const excludeFields = ['page', 'sort', 'limit']
        excludeFields.forEach(el => delete (queryObj[el]))


        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|regex)\b/g, match => '$' + match)

        //gte: filter >= gte
        //gt: filter > gt
        //lte: filter <= lte
        //lt: filter < lt
        //regex: find regex 
        this.query.find(JSON.parse(queryStr))

        return this
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            //Sort by time
            this.query = this.query.sort('-createdAt')
        }

        return this
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const productController = {
    //GET ALL PRODUCTS
    getProducts: async (req, res) => {
        try {

            const features = new APIfeatures(Products.find(), req.query)
                .filtering().sorting().paginating()

            const products = await features.query

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //GET 1 PRODUCT
    getProduct: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id)
            if (product) {
                res.json(product)
            } else {
                res.status(400).json({ msg: "Product not found" })
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //CREATE PRODUCT
    createProduct: async (req, res) => {
        try {
            const { name, price, dateOfBirth, description, movie, image, category } = req.body
            if (!image) {
                return res.status(400).json({ msg: "No image upload" })
            }

            const newProduct = new Products({
                _id: req.params.id,
                name,
                price,
                dateOfBirth,
                description,
                movie,
                image,
                category
            })
            await newProduct.save()
            res.json({ msg: "Created a product" })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //DELETE PRODUCT
    deleteProduct: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id)
            if (!product) {
                res.status(400).json({ msg: "Product not found" })
            }
            await Products.findByIdAndDelete(req.params.id)
            res.json({ msg: "Deleted a product" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    //UPDATE PRODUCT
    updateProduct: async (req, res) => {
        try {
            const { name, price, dateOfBirth, description, movie, image, category } = req.body
            if (!image) {
                return res.status(400).json({ msg: "No image upload" })
            }
            await Products.findByIdAndUpdate({
                _id: req.params.id
            }, {
                name, price, dateOfBirth, description, movie, image, category
            })
            await Products.findById()
            res.json({ msg: "Updated a product" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
}


module.exports = productController