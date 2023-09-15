require('dotenv').config()

const express = require('express')
require('express-async-errors')
const app = express()
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { unknownEndpoint, errorHandler } = require('./middleware')

const {
  blogsRouter,
  usersRouter,
  loginRouter,
  authorsRouter,
  readingListsRouter,
  logoutRouter,
} = require('./controllers')

app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListsRouter)
app.use('/api/logout', logoutRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
