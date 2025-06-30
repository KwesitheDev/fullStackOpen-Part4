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

    test('a blog can be deleted', async () => {
        
        const blogToDelete = await helper.getFirstBlogID()

        await api
            .delete(`/api/blogs/${blogToDelete}`)
            .expect(204)

        const blogsAtEnd = await helper.blogInDb()
        const ids = blogsAtEnd.map(b => b.id)

        if (ids.includes(blogToDelete.id)) {
            throw new Error('Deleted blog still exists in database')
        }
    })

    test('a blog can be updated with PUT', async () => {
    const blogsAtStart = await helper.blogInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
        title: 'Updated Title',
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 10
    }

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    if (response.body.likes !== updatedData.likes) {
        throw new Error('Blog likes not updated correctly')
    }

    if (response.body.title !== updatedData.title) {
        throw new Error('Blog title not updated correctly')
    }
})

})

after(async () => {
    await mongoose.connection.close()
})