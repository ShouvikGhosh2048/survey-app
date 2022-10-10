const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

const signup = asyncHandler(async (req, res) => {
    let { username, password } = req.body
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string' || username.trim().length === 0) {
        return res.status(400)
                    .json({
                        error: 'Valid username and password required'
                    })
    }
    username = username.trim()

    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)

    try {
        const user = await User.create({
            username,
            password: hashedPassword,
        })
        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, { expiresIn: '3d' })
        // https://stackoverflow.com/a/36373586
        // https://stackoverflow.com/a/44396004
        return res.status(200).json(token)
    } catch (err) {
        if (err.message.includes('duplicate key error')) {
            return res.status(400)
                        .json({
                            error: 'A user with the given username already exists'
                        })
        }
        else {
            return res.status(500)
                        .json({
                            error: "Couldn't create the user"
                        })
        }
    }
})

const login = asyncHandler(async (req, res) => {
    let { username, password } = req.body
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400)
                    .json({
                        error: 'Valid username and password required'
                    })
    }
    username = username.trim()

    const user = await User.findOne({ username })
    if (!user) {
        return res.status(400)
                    .json({
                        error: 'Invalid credentials'
                    })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return res.status(400)
                    .json({
                        error: 'Invalid credentials'
                    })
    }

    const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, { expiresIn: '3d' })
    return res.status(200).json(token)
})

module.exports = {
    signup,
    login,
}