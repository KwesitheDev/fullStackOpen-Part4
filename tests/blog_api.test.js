const { test, describe, after, beforeEach, before } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/blog_api_helper')
const Blog = require('../models/blogSchema')
const config = require('../utils/config')

before(async () => {
    await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
    await helper.resetDbWithInitialBlog()
})

describe('when there is initially one blog in the db', () => {
    test('blogs are returned as JSON and contain id property', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        if (!response.body[0].id) {
            throw new Error('Blog does not have id property')
        }
    })

    test('a new blog can be added with POST', async () => {
        const initialBlogs = await helper.blogInDb()

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

        const allBlogs = await helper.blogInDb()

        if (allBlogs.length !== initialBlogs.length + 1) {
            throw new Error('Blog count did not increase')
        }

        const titles = allBlogs.map(b => b.title)
        if (!titles.includes(newBlog.title)) {
            throw new Error('New blog title not found in database')
        }
    })
})

after(async () => {
    await mongoose.connection.close()
})