const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const express = require('express')
const bodyParser = require('body-parser')
require('express-async-errors')
const app = express()
app.use(bodyParser.json())
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')
const loginRouter = require('./controllers/login')
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)


logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).catch(error => console.log(error))

app.use(cors())
app.use(express.json())
app.use(middleware.errorHandler)

module.exports = app