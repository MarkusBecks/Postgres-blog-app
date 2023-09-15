const router = require('express').Router()
const { ReadingList, Blog, User } = require('../models')
const { tokenExtractor, userExtractor, accessGuard } = require('../middleware')

router.get('/', async (req, res) => {
  const readingLists = await ReadingList.findAll()
  res.json(readingLists)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const readingList = await ReadingList.findOne({
    where: { id },
  })
  res.json(readingList)
})

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  const blog = await Blog.findByPk(blogId)
  const user = await User.findByPk(userId)
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  const readingEntry = await ReadingList.create({ blogId, userId })
  res.json(readingEntry)
})

router.put(
  '/:id',
  tokenExtractor,
  userExtractor,
  accessGuard,
  async (req, res) => {
    const { id } = req.params
    const { read } = req.body
    const user = req.user

    const readingList = await ReadingList.findOne({
      where: { id },
    })

    if (!readingList) {
      return res.status(404).json({ error: 'Unable to find reading list.' })
    }
    if (readingList.userId !== user.id) {
      return res.status(401).json({ error: 'Unauthorized!' })
    }
    readingList.read = read
    await readingList.save()
    res.json(readingList)
  }
)

module.exports = router
