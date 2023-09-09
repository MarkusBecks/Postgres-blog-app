const express = require('express')
const router = express.Router()
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  if (req.body) {
    console.log(req.body)
    const blog = await Blog.create(req.body)
    res.json(blog)
  } else {
    res.status(400).json({ error: 'Invalid request body' })
  }
})

const singleRouter = express.Router()

const blogFinder = async (req, res, next) => {
  const { id } = req.params
  console.log('running blogFinder middleware')
  req.blog = await Blog.findByPk(id)
  console.log('req.blog: ', req.blog)

  next()
}

singleRouter.get('/', async (req, res) => {
  req.blog ? res.json(req.blog) : res.status(404).end()
})

singleRouter.delete('/', async (req, res) => {
  if (req.blog) {
    await req.blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).json({ error: 'No blog found' })
  }
})

singleRouter.put('/', async (req, res) => {
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
})

router.use('/:id', blogFinder, singleRouter)

module.exports = router
