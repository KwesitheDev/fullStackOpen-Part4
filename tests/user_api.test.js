const { test, describe, before, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/user_api_helper')
const { User } = require('../models/Users')
const config = require('../utils/config')

describe("when there is initially one user in the db", () => {
    before(async () => {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(config.MONGODB_URI)
    await mongoose.connection.asPromise() 
    
})

    beforeEach(async () => {
        await helper.resetDbWithInitialUser()
    })

    after(async () => {
        console.log('Disconnecting from MongoDB...')
        await mongoose.connection.close()
    })

    test("users are returned as JSON and contain id property", async () => {
        const response = await api
            .get('/api/users')
            .expect(200)
            .expect("Content-Type", /application\/json/)

        if (!response.body[0].id) {
            throw new Error('User does not have id property')
        }
    })

    test("creation fails with short username", async () => {
    const newUser = {
        name: "Tiny User",
        username: "ab",
        password: "securepass"
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    if (!response.body.error.includes("at least 3 characters")) {
        throw new Error("Expected error about username length")
    }

    const users = await helper.userInDb()
    const usernames = users.map(u => u.username)
    if (usernames.includes("ab")) {
        throw new Error("Invalid user was added to DB")
    }
})

test("creation fails with missing password", async () => {
    const newUser = {
        name: "No Pass",
        username: "nopassword"
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    if (!response.body.error.includes("required")) {
        throw new Error("Expected error about required password")
    }
})

test("creation fails with non-unique username", async () => {
    const newUser = {
        name: "Duplicate",
        username: "KwesitheDev", 
        password: "anotherpassword"
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    if (!response.body.error.includes("unique")) {
        throw new Error("Expected error about uniqueness")
    }
})

    
})
