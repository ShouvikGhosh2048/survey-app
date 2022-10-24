const Survey = require('../models/surveyModel')
const User = require('../models/userModel')
const Response = require('../models/responseModel')
const asyncHandler = require('express-async-handler')

const getResponse = asyncHandler(async (req, res) => {
    const response = await Response.findOne({
        user: req.userId,
        survey: req.params.surveyId
    })
    if (!response) {
        return res.status(404)
                .json({
                    error: 'Not found',
                })
    }

    return res.status(200).json(response)
})

const createResponse = asyncHandler(async (req, res) => {
    let user = await User.findById(req.userId)
    if (!user) {
        return res.status(403)
                    .json({
                        error: 'Invalid authorization'
                    })
    }

    let survey = await Survey.findById(req.params.surveyId)
    if (!survey) {
        return res.status(400)
                    .json({
                        error: 'No such survey exists'
                    })
    }

    if (survey.state !== 'open') {
        return res.status(403)
                    .json({
                        error: "Survey isn't open"
                    })
    }

    // Validate the choices
    if (!Array.isArray(req.body)) {
        return res.status(400)
                    .json({
                        error: 'Choices must be an array'
                    })
    }
    if (req.body.length !== survey.questions.length) {
        return res.status(400)
                    .json({
                        error: 'Choices must have a length equal to the number of questions'
                    })
    }
    for (let i = 0; i < survey.questions.length; i++) {
        const question = survey.questions[i]
        if (!Number.isInteger(req.body[i]) || req.body[i] < 0 || req.body[i] >= question.choices.length) {
            return res.status(400)
                        .json({
                            error: 'Choices must have valid entries'
                        })
        }
    }

    try {
        const response = await Response.create({
            user: user.id,
            survey: survey.id,
            choices: req.body
        })
        return res.status(200).json(response)
    } catch(err) {
        if (err.message.includes('duplicate key error')) {
            return res.status(403)
                    .json({
                        error: 'You have already created a response'
                    })
        }
        return res.status(400)
                    .json({
                        error: 'Invalid survey'
                    })
    }
})

module.exports = { getResponse, createResponse }