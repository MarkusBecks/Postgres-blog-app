require('dotenv').config()

const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

async function printBlogs() {
  try {
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    })
    // Print each blog
    blogs.forEach((blog) => {
      const author = blog.author ? blog.author : ''
      console.log(`${author}: '${blog.url}', ${blog.likes} likes`)
    })
  } catch (error) {
    console.error('Error retrieving blogs:', error)
  }
  await sequelize.close()
}

printBlogs()
