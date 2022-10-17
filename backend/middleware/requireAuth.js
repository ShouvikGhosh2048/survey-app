const jwt = require('jsonwebtoken')

function getUserId(req) {
    const { authorization } = req.headers
    if (!authorization) {
        return null
    }

    let token = authorization.split(' ')[1]
    if (!token) {
        return null
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRET_KEY)
        return id
    }
    catch (err) {
        return null
    }
}

function requireAuth(req, res, next) {
    const userId = getUserId(req)

    if (userId === null) {
        return res.status(403)
            .json({
                error: 'Invalid authorization'
            })
    }
    else {
        req.userId = userId
        next()
    }
}

module.exports = { getUserId, requireAuth }