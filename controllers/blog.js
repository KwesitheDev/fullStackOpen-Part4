const blogsRouter = require('express').Router()
const Blog = require('../models/blogSchema')
const { User } = require('../models/Users') 
const {userExtractor} = require('../utils/tokenExtractor')


blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1
    })
    res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
    const { title, author, url, likes } = req.body

    const user = await User.findById(req.user.id)
    if (!user) {
        return res.status(401).json({ error: 'invalid user' })
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (req, res) => {
    const id = req.params.id
    await Blog.findByIdAndDelete(id)
    res.status(204).end()
})


blogsRouter.put('/:id', async (req, res) => {
    const body = req.body
    const id = req.params.id

    const updatedFields = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedFields, { new: true })
    res.json(updatedBlog)
})

module.exports = blogsRouter
