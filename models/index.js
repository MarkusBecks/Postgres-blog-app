const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: ReadingList, as: 'readers' })
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })

// remove sync for migrations
//Blog.sync({ alter: true })
//User.sync({ alter: true })

module.exports = {
  Blog,
  User,
  ReadingList,
}
