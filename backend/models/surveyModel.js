const mongoose = require('mongoose')

const nonEmptyStringValidator = {
    validator: function(v) {
        return v.trim() !== ''
    },
    message: props => 'Non empty string required'
}

// https://stackoverflow.com/a/29418656
// https://mongoosejs.com/docs/validation.html
const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        validate: nonEmptyStringValidator,
    },
    questions: {
        type: [{
                text: {
                    type: String,
                    required: true,
                    trim: true,
                    validate: nonEmptyStringValidator,
                },
                choices: {
                    type: [{
                            type: String,
                            required: true,
                            trim: true,
                            validate: nonEmptyStringValidator,
                    }],
                    validate: {
                        validator: function(v) {
                            return (2 <= v.length) && (v.length <= 5)
                        },
                        message: props => 'choices must have a length between 2 and 5'
                    }
                }
        }],
        validate: {
            validator: function(v) {
                return (1 <= v.length) && (v.length <= 10)
            },
            message: props => 'questions must have a length between 1 and 10'
        }
    },
    state: {
        type: String,
        enum: ['saved', 'open', 'closed'],
        required: true,
        default: 'saved',
    },
    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = mongoose.model('Survey', surveySchema)