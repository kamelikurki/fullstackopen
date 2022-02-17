const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)



const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }  
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
})

test('Correct number of blogs is returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(blogs.length)
})

test('Returned format is JSON', async () => {
  const response = await api.get('/api/blogs')
  expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'))
})

test('Id is stored in field \'id\'', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blogentry => expect(blogentry['id']).toBeDefined())
})


test('Blog with the correct title is in collection after post', async () => {
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
  expect(response.body).toHaveLength(blogs.length + 1)
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

  expect(response.body).toHaveLength(blogs.length)

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

  expect(response.body).toHaveLength(blogs.length)

})

test('a blog can be deleted', async () => {


  const initialBlogs = await Blog.find({})

  const blogToDelete = initialBlogs[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsinDB = await Blog.find({})

  expect(blogsinDB).toHaveLength(
    blogs.length - 1
  )

  const contents = blogsinDB.map(r => r.title)

  expect(contents).not.toContain(blogToDelete.title)
})


test.only('Likes on a blog can be updated', async () => {


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