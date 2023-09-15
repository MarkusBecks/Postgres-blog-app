const blogsRouter = require('./blogs')
const usersRouter = require('./users')
const loginRouter = require('./login')
const authorsRouter = require('./authors')
const readingListsRouter = require('./readingLists')
const logoutRouter = require('./logout')

module.exports = {
  blogsRouter,
  usersRouter,
  loginRouter,
  authorsRouter,
  readingListsRouter,
  logoutRouter,
}
