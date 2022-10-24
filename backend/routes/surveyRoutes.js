const express = require('express')
const { getSurvey, createSurvey, updateSurvey, getSurveys, getOpenSurveys, getClosedSurveys } = require('../controllers/surveyControllers')
const { requireAuth } = require('../middleware/requireAuth')

const router = express.Router()

router.get('/', requireAuth, getSurveys)
router.get('/open', getOpenSurveys)
router.get('/closed', getClosedSurveys)
router.get('/:surveyId', getSurvey)
router.post('/', requireAuth, createSurvey)
router.patch('/:surveyId', requireAuth, updateSurvey)

module.exports = router