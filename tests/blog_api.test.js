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


after(async () => {
    await mongoose.connection.close()
})
