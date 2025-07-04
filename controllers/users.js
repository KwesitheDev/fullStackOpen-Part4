const usersRouter = require('express').Router()
const  User  = require('../models/Users') 
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const { name, username, password } = req.body

    //check for username and password not missing
    if (!username || !password) {
        return res
                .status(400)
                .json({ error: 'username and password are required' })

    }

    //Check for length of username & password
    if (username.length < 3 || password.length < 3) {
        return res.status(400).json({ error: 'username and password must be at least 3 characters long' })
    }

    //Check for unique username
    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return res.status(400).json({ error: 'username must be unique' })
    }

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

module.exports = usersRouter
