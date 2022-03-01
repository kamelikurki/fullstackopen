const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  
  const allBlogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(allBlogs)
})

blogsRouter.post('/', async (request, response) => {
  
  const body = request.body

  const token = request.token
  
  if (!token || !request.user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(request.user.id)

  if(body.title === undefined || body.url === undefined)
  {
    response.status(400).end()
  }
  else
  {
    const blog = new Blog({
      author: body.author,
      title: body.title,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })
  
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  
    response.status(201).json(savedBlog)
  }
})


blogsRouter.delete('/:id', async (request, response) => {

  const token = request.token

  const blogToRemove = await Blog.findByIdAndRemove(request.params.id)

  if (!token || !request.user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (!(request.user.id.toString() === blogToRemove.id.toString())) {
    return response.status(401).json({ error: 'Blog can only be removed by the user who added it' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blogupdate = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogupdate, { new: true })

  response.json(updatedBlog.toJSON())
})



module.exports = blogsRouter