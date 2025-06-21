const blogsRouter = require('express').Router()
const Blog = require('../models/blogSchema')

blogsRouter.get('/', (req, res) => {
    Blog.find({}).then(blogs => {
        res.json(blogs)
    })
})

blogsRouter.post('/', (req, res) => {
    const blog = new Blog(req.body)

    Blog.save().then(result => {
        res.status(201).json(result)
    })
})

module.exports = blogsRouter