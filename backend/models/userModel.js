const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isCoordinator: {
        type: Boolean,
        required: true,
        default: false,
    }
})

module.exports = mongoose.model('User', userSchema)