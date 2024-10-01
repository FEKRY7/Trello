const mongoose = require('mongoose')

const { Types } = mongoose

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: "user"
    },
    isValid: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true })

const tokenModel = mongoose.model("token", tokenSchema)
module.exports = tokenModel