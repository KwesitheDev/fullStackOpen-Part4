const { test, describe, after, beforeEach, before } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogSchema')
const config = require('../utils/config')

before(async () => {
    await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
    await Blog.deleteMany({})

    const blog = new Blog({
        title: 'test',
        author: 'KwesitheDev',
        url: 'kwesithedev.me',
        likes: 50
    })

    await blog.save()
})

test('blog posts have property id', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

})

test('blog can be added via post', async () => {
    const initialBlogs = await Blog.find({})

    const newBlog = {
        title: 'another test',
        author: 'KwesitheDev',
        url: 'kwesithedev.me',
        likes: 15
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    
    const allBlogs = await Blog.find({})

    console.log(`Current length: ${allBlogs.length} ---- Previous length: ${initialBlogs.length}`)
    if (allBlogs.length !== initialBlogs.length + 1) {
        throw new Error('Blog count did not increase')
    }

    
    const titles = allBlogs.map(b => b.title)
    if (!titles.includes(newBlog.title)) {
        throw new Error('New blog title not found in database')
    }
})




after(async () => {
    await mongoose.connection.close()
})
