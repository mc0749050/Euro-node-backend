const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    instock: {
        type: Boolean,
        default: true
    },
    stocknumber: {
        type: Number,
        required: true
    },
})

const product = mongoose.model('products', productSchema)

module.exports = product;