const mongoose = require('mongoose');

const contectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    isreplyed:{
        type:Boolean,
        default:false
    }
})

const contectModel = mongoose.model('contectforms', contectSchema);

module.exports = contectModel;