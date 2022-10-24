//https://mongoosejs.com/docs/transactions.html
//https://stackoverflow.com/questions/41444213/how-do-i-increment-a-number-value-in-mongoose
//https://stackoverflow.com/questions/16887107/how-to-avoid-a-race-condition-in-nodejs-and-mongoose-app
//https://stackoverflow.com/questions/28357965/mongoose-auto-increment
//https://stackoverflow.com/a/70064399
//https://stackoverflow.com/questions/17459167/mongoose-js-transactions
//https://stackoverflow.com/a/14693445

const mongoose = require('mongoose')

const responseSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    survey: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Survey'
    },
    choices: [{
        type: Number,
        required: true,
    }]
})

// A user can only submit a single response.
responseSchema.index({ user: 1, survey: 1 }, { unique: true })

module.exports = mongoose.model('Response', responseSchema)