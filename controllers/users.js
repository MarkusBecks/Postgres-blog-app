const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['passwordHash'],
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

const userFinder = async (req, res, next) => {
  const { id } = req.params
  req.user = await User.findByPk(id, {
    attributes: {
      exclude: ['passwordHash'],
    },
  })

  next()
}

router.get('/:id', userFinder, async (req, res) => {
  const user = req.user
  if (!user) {
    res.status(404).json({ error: 'user not found' })
  } else {
    res.json(user)
  }
})

router.put('/:username', async (req, res) => {
  const { username } = req.params
  const { username: updatedUsername } = req.body

  req.user = await User.findOne({
    where: {
      username,
    },
  })
  if (req.user) {
    req.user.username = updatedUsername
    await req.user.save()
    res.json(req.user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
