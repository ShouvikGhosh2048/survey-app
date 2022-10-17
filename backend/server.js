require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const userRoutes = require('./routes/userRoutes')
const surveyRoutes = require('./routes/surveyRoutes')

const app = express()

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/survey', surveyRoutes)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500)
        .json({
            error: 'Server error'
        })
})

mongoose.connect(process.env.MONGO_URI, () => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Listening on port ${process.env.PORT || 5000}`)
    })
}).catch((err) => {
    console.log(`Couldn't connect to the database : ${err}`)
})
