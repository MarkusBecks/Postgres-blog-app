const express = require('express')
const router = express.Router()
const { Blog } = require('../models')
const { Sequelize } = require('sequelize')

router.get('/', async (req, res) => {
  const result = await Blog.findAll({
    attributes: [
      'author',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'articles'],
      [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes'],
    ],
    group: ['author'],
    order: [[Sequelize.literal('"likes" DESC')]],
  })

  res.json(result)
})

module.exports = router
