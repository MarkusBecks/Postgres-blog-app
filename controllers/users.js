const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog } = require('../models')
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

router.get('/:id', async (req, res) => {
  const readQuery = (req.query.read || '').toLowerCase() // convert to lowercase for case-insensitivity
  const readCondition = readQuery === 'true'

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
        through: {
          attributes: ['id', 'read'],
          where: readQuery ? { read: readCondition } : {},
        },
      },
    ],
  })

  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  } else {
    res.json(user)
  }
})

router.put('/:username', userFinder, async (req, res) => {
  if (req.user) {
    req.user.username = req.body.username
    await req.user.save()
    return res.json(req.user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
