const express = require('express')
const { getResponse, createResponse } = require('../controllers/responseControllers')
const { requireAuth } = require('../middleware/requireAuth')

const router = express.Router()

router.get('/:surveyId', requireAuth, getResponse)
router.post('/:surveyId', requireAuth, createResponse)

module.exports = router