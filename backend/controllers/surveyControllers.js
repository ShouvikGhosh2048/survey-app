const { getUserId } = require('../middleware/requireAuth')
const Survey = require('../models/surveyModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const getSurveys = asyncHandler(async (req, res) => {
    let user = await User.findById(req.userId)
    if (!user) {
        return res.status(403)
                    .json({
                        error: 'Invalid authorization'
                    })
    }

    if (!user.isCoordinator) {
        return res.status(403)
                    .json({
                        error: 'Unauthorized - you are not a coordinator'
                    })
    }

    const surveys = await Survey.find({ creator: req.userId }, 'title state creator')
    
    return res.status(200).json(surveys)
})

const getSurvey = asyncHandler(async (req, res) => {
    const survey = await Survey.findById(req.params.surveyId)
    if (!survey) {
        return res.status(404)
                .json({
                    error: 'Not found',
                })
    }

    // If the survey is open/closed, then anyone can access the survey.
    if (survey.state !== 'saved') {
        return res.status(200).json(survey)
    }

    // If the survey is saved, then only the creator can access the survey, and only when they're a coordinator.
    let userId = getUserId(req)

    let user = await User.findById(userId)
    if (!user) {
        return res.status(403)
                    .json({
                        error: 'Invalid authorization'
                    })
    }

    if (!user.isCoordinator) {
        return res.status(403)
                    .json({
                        error: 'Unauthorized - you are not a coordinator'
                    })
    }

    if (userId !== survey.creator.toString()) {
        return res.status(403)
                .json({
                    error: 'Unauthorized - you are not the creator'
                })
    }
    else {
        return res.status(200).json(survey)
    }
})

const createSurvey = asyncHandler(async (req, res) => {
    let user = await User.findById(req.userId)
    if (!user) {
        return res.status(403)
                    .json({
                        error: 'Invalid authorization'
                    })
    }

    if (!user.isCoordinator) {
        return res.status(403)
                    .json({
                        error: 'Unauthorized - you are not a coordinator'
                    })
    }

    let { title, questions } = req.body

    let survey = {
        title,
        questions,
        creator: user.id
    }

    try {
        survey = await Survey.create(survey)
    } catch(err) {
        return res.status(400)
                    .json({
                        error: 'Invalid survey'
                    })
    }

    return res.status(200).json(survey)
})

const updateSurvey = asyncHandler(async (req, res) => {
    let user = await User.findById(req.userId)
    if (!user) {
        return res.status(403)
                    .json({
                        error: 'Invalid authorization'
                    })
    }

    if (!user.isCoordinator) {
        return res.status(403)
                    .json({
                        error: 'Unauthorized - you are not a coordinator'
                    })
    }

    let survey = await Survey.findById(req.params.surveyId)
    if (!survey) {
        return res.status(404)
                    .json({
                        error: 'Not found',
                    })
    }

    if (req.userId !== survey.creator.toString()) {
        return res.status(403)
                    .json({
                        error: 'Not authorized'
                    })
    }

    let { title, questions, state } = req.body
    
    // Only allow state change if the survey is open or closed.
    if (survey.state === 'open' || survey.state === 'closed') {
        if (state === 'open' || state === 'closed') {
            survey = await Survey.findByIdAndUpdate(survey.id, { state })
            return res.status(200).json(survey)
        } else {
            return res.status(400).json({
                error: `The survey is currently ${survey.state}. It only allows state changes.`
            })
        }
    }

    const newSurvey = {}
    if (title !== undefined) {
        newSurvey.title = title
    }
    if (questions !== undefined) {
        newSurvey.questions = questions
    }
    if (state !== undefined) {
        newSurvey.state = state
    }

    try {
        // https://stackoverflow.com/a/32792126
        survey = await Survey.findByIdAndUpdate(survey.id, newSurvey, { runValidators: true })
    } catch (err) {
        return res.status(400)
                    .json({
                        error: 'Invalid survey'
                    })
    }

    res.status(200).json(survey)
})

module.exports = { getSurveys, getSurvey, createSurvey, updateSurvey }