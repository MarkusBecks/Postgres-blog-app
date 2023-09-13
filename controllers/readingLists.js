const router = require('express').Router()
const { ReadingList, Blog, User } = require('../models')

router.get('/', async (req, res) => {
  const readingLists = ReadingList.findAll()
  res.json(readingLists)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const readingList = ReadingList.findOne({
    where: { id },
  })
  res.json(readingList)
})

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  const blog = await Blog.findByPk(blogId)
  const user = await User.findByPk(userId)
  if (!blog) {
    res.status(404).json({ error: 'Blog not found' })
  }
  if (!user) {
    res.status(404).json({ error: 'User not found' })
  }
  const readingEntry = await ReadingList.create({ blogId, userId })
  res.json(readingEntry)
})

module.exports = router
