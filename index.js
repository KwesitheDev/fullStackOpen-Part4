const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes:Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'dummyurl'
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

const PORT = 3003

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})