const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
//const User = require('../models/user')
const api = supertest(app)
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  const newUser = {
    'username': 'pope',
    'name': 'Popsi Panda',
    'password': 'bambu' 
  }

  await api
    .post('/api/users')
    .send(newUser)

})



test('Correct number of blogs is returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('Returned format is JSON', async () => {
  const response = await api.get('/api/blogs')
  expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'))
})

test('Id is stored in field \'id\'', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blogentry => expect(blogentry['id']).toBeDefined())
})


test.only('Blog with the correct title is in collection after post', async () => {

  
  const response = await api
    .post('/api/login')
    .send(
      {
        'username': 'pope',
        'password': 'bambu'
      })
  
  console.log(response.body)

  const newBlog = {
    title: 'Villen Blogi',
    author: 'Ville Saari',
    url: 'www.google.com',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `bearer ${response.body.token}`)
    .expect(201) 
    .expect('Content-Type', /application\/json/)
  

  const blogsinDB = await Blog.find({})
  const blogsJSON =  blogsinDB.map(blogi => blogi.toJSON())

  const contents = blogsJSON.map(n => n.title)
  expect(contents).toContain(
    'Villen Blogi'
  )
})


test('Adding blog increments the number of blogs by 1', async () => {
  const newBlog = {
    title: 'Villen Blogi',
    author: 'Ville Saari',
    url: 'www.google.com',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
})


test('Blog has 0 likes if it is added with no likes field defined', async () => {
  const newBlog = {
    title: 'Villen Blogi 2',
    author: 'Ville Saari',
    url: 'www.google.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body[response.body.length-1].likes).toBe(0)
})

test('If blog has no title, server returns 400 and no blog is added', async () => {
  const newBlog = {
    author: 'Ville Saari',
    url: 'www.google.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)


  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)

})

test('If blog has no url, server returns 400 and no blog is added', async () => {
  const newBlog = {
    author: 'Ville Saari',
    title: 'Villes blog'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)


  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)

})

test('a blog can be deleted', async () => {


  const initialBlogs = await Blog.find({})

  const blogToDelete = initialBlogs[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsinDB = await Blog.find({})

  expect(blogsinDB).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const contents = blogsinDB.map(r => r.title)

  expect(contents).not.toContain(blogToDelete.title)
})


test('Likes on a blog can be updated', async () => {


  const initialBlogs = await Blog.find({})

  const blogToUpdate = initialBlogs[0]

  const initialLikes = initialBlogs[0].likes

  blogToUpdate.likes  =  blogToUpdate.likes + 1

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate.toJSON())
    .expect(200)

  const blogsinDB = await Blog.find({})
  console.log(blogsinDB[0])
  expect(blogsinDB[0].likes).toBe(
    initialLikes + 1 
  )
})



afterAll(() => {
  mongoose.connection.close()
})