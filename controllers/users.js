const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
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
  console.log('running userFinder middleware')
  req.user = await User.findByPk(id)
  console.log('req.blog: ', req.user)

  next()
}

router.get('/:id', async (req, res) => {
  if (req.user) {
    // do stuff
  } else {
    res.status(404).end()
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
