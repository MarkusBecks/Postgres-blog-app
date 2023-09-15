const router = require('express').Router()
const { tokenExtractor, userExtractor, accessGuard } = require('../middleware')

router.get(
  '/',
  tokenExtractor,
  userExtractor,
  accessGuard,
  async (req, res) => {
    res.send('This is where you log out')
  }
)

router.delete(
  '/',
  tokenExtractor,
  userExtractor,
  accessGuard,
  async (req, res) => {
    try {
      await req.session.destroy()
      res.status(200).json({ msg: 'Session killed. Logging out.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message })
    }
  }
)

module.exports = router
