const { getUserId } = require('../middleware/requireAuth')
const Survey = require('../models/surveyModel')
const User = require('../models/userModel')
const Response = require('../models/responseModel')
const asyncHandler = require('express-async-handler')

const getSurveys = asyncHandler(async (req, res) => {
    let user = await User.findById(req.userId)
    if (!user) {
        return res.status(403)
                    .json({
                        error: 'Invalid authorization'
                    })
    }

    const created = await Survey.find({ creator: req.userId }, 'title state')
    let submitted = await Response.find({ user: req.userId }, 'survey').populate('survey', 'title state')
    submitted = submitted.map(survey => survey.survey)
    
    return res.status(200).json({ created, submitted })
})

const getOpenSurveys = asyncHandler(async (req, res) => {
    const openSurveys = await Survey.find({ state: 'open' }, 'title state')
    return res.status(200).json(openSurveys)
})

const getClosedSurveys = asyncHandler(async (req, res) => {
    const closedSurveys = await Survey.find({ state: 'closed' }, 'title state')
    return res.status(200).json(closedSurveys)
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
    
    // No changes allowed if the survey is closed.
    if (survey.state === 'closed') {
        return res.status(400).json({
            error: "The survey is closed and can't be edited"
        })
    }

    // If the survey is open, only allow closing the survey.
    if (survey.state === 'open') {
        if (state === 'closed') {
            survey = await Survey.findByIdAndUpdate(survey.id, { state })
            return res.status(200).json(survey)
        } else {
            return res.status(400).json({
                error: 'The survey is currently open and only allows closing'
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

module.exports = { getSurveys, getOpenSurveys, getClosedSurveys, getSurvey, createSurvey, updateSurvey }