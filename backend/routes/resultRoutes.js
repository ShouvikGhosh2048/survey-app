const express = require('express')
const { getResult } = require('../controllers/resultControllers')

const router = express.Router()

router.get('/:surveyId', getResult)

module.exports = router