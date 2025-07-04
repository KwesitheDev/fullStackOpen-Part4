const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        req.token = auth.substring(7)
    }
    next()
}

const userExtractor = async (req, res, next) => {
    if (!req.token) {
        return res.status(401).json({ error: 'token missing' })
    }

    try {
        const decoded = jwt.verify(req.token, process.env.SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: 'token invalid' })
    }
}

module.exports = {
    tokenExtractor,
    userExtractor
}
