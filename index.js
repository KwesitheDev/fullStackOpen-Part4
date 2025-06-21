const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Blog = require('./models/blogSchema')

dotenv.config()

const app = express()



const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())

app.get('/api/blogs', (req, res) => {
    Blog.find({}).then(blogs => {
        res.json(blogs)
    })
})

app.post('/api/blogs', (req, res) => {
    const blog = new Blog(req.body)

    blog.save().then(result => {
        res.status(201).json(result)
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})