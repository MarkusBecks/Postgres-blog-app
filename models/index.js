const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

Session.belongsTo(User, { foreignKey: 'userId' })
User.hasOne(Session)

Blog.belongsToMany(User, { through: ReadingList, as: 'readers' })
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })

// remove sync for migrations
//Blog.sync({ alter: true })
//User.sync({ alter: true })

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
}
