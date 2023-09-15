const express = require('express')
const router = express.Router()
const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const {
  tokenExtractor,
  userExtractor,
  blogFinder,
  accessGuard,
} = require('../middleware')

router.get('/', async (req, res) => {
  const { search } = req.query

  const titleOrAuthorFilter = search
    ? {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            author: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      }
    : {} // If search is empty, return all blogs

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where: titleOrAuthorFilter,
    order: [['likes', 'DESC']],
  })

  res.json(blogs)
})

router.post(
  '/',
  tokenExtractor,
  userExtractor,
  accessGuard,
  async (req, res) => {
    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'authentication failed' })
    }
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.status(201).json(blog)
  }
)

const singleRouter = express.Router()

singleRouter.get('/', async (req, res) => {
  req.blog ? res.json(req.blog) : res.status(404).end()
})

singleRouter.delete(
  '/',
  tokenExtractor,
  userExtractor,
  accessGuard,
  async (req, res) => {
    const user = req.user
    const blog = req.blog

    if (!user) {
      return res.status(401).json({ error: 'authentication failed' })
    }
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }
    if (blog.userId !== user.id) {
      return res.status(401).json({ error: 'unauthorized' })
    } else {
      await blog.destroy()
      res.status(204).end()
    }
  }
)

singleRouter.put(
  '/',
  tokenExtractor,
  userExtractor,
  accessGuard,
  async (req, res) => {
    const { author, url, likes } = req.body
    if (req.blog) {
      req.blog.author = author
      req.blog.url = url
      req.blog.likes = likes
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(404).json({ error: 'No blog found' })
    }
  }
)

router.use('/:id', blogFinder, singleRouter)

module.exports = router
