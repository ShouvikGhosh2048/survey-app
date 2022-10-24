const Survey = require('../models/surveyModel')
const Response = require('../models/responseModel')
const asyncHandler = require('express-async-handler')

const getResult = asyncHandler(async (req, res) => {
    let survey = await Survey.findById(req.params.surveyId)
    if (!survey) {
        return res.status(404)
                    .json({
                        error: 'No such survey exists'
                    })
    }
    if (survey.state !== 'closed') {
        return res.status(400)
                    .json({
                        error: 'The survey needs to be closed'
                    })
    }

    const responses = await Response.find({ survey: survey.id })

    let result = { survey }
    result.numberOfSubmissions = responses.length
    result.counts = []
    survey.questions.forEach((question, index) => {
        let counts = new Array(question.choices.length).fill(0)
        responses.forEach(response => {
            counts[response.choices[index]]++
        })
        result.counts.push(counts)
    })

    res.status(200).json(result)
})

module.exports = { getResult }