const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    movie: {
        type: String,
        required: true,
    },
    image: {
        type: Object,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    sold: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Products', productSchema)