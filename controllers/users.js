const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
const { userFinder } = require('../middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['passwordHash', 'createdAt', 'updatedAt'],
    },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({ username, name, passwordHash })
  res.json(user)
})

/* router.get('/', async (req, res) => {
  const { id } = req.params
  const readingList = await ReadingList.findAll({
    include: {
      model: Blog,
      attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
    },
    where: { id },
  })

  res.json(readingList)
}) */

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({
    where: { id },
    attributes: {
      exclude: ['passwordHash', 'createdAt', 'updatedAt', 'admin', 'disabled'],
    },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: { attributes: ['id', 'read'] },
      },
    ],
  })

  if (!user) {
    res.status(404).json({ error: 'user not found' })
  } else {
    res.json(user)
  }
})

router.put('/:username', userFinder, async (req, res) => {
  if (req.user) {
    req.user.username = req.body.username
    await req.user.save()
    res.json(req.user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
