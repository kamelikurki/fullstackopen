const blogsRouter = require('./controllers/blogs')

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')

app.use('/api/blogs', blogsRouter)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).catch(error => console.log(error))

app.use(cors())
app.use(express.json())

module.exports = app