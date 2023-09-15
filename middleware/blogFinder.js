const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  const { id } = req.params
  req.blog = await Blog.findByPk(id)

  next()
}

module.exports = blogFinder
