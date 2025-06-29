const blogsRouter = require('express').Router()
const Blog = require('../models/blogSchema')

blogsRouter.get('/',async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body)
    const savedBlog = await blog.save()

    res.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (req, res) => {
    const id = req.params.id
    await Blog.findByIdAndDelete(id)
    res.status(204).end()
})


module.exports = blogsRouter