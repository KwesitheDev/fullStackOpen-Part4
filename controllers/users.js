const usersRouter = require('express').Router()
const User = require('../models/Users')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (req, res) => {
    const { name, username, password } = req.body
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        name,
        username,
        passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

module.exports = {
    usersRouter
}