const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
    },
    address: {
        street: {
            type: String,
            default: " "
        },
        city:{
            type: String,
            default: " "
        },
        state: {
            type: String,
            default: " "
        },
        country:{
            type: String,
            default: " "
        },
        zipcode: {
            type: String,
            default: " "
        },
        phone: {
            type: String,
            default: " "
        }
    },
    role:{
        type: Number,
        default: 0
    },
    cart:{
        type:[],
        default:[]
    }
},
{timestamps: true}
)

const User = mongoose.model('Users', userSchema);
module.exports = User;