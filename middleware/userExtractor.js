const { User } = require('../models')

const userExtractor = async (req, res, next) => {
  const token = req.decodedToken // Assuming tokenExtractor has already run
  if (!token) {
    return res.status(401).json({ error: 'missing token' })
  }

  try {
    const user = await User.findByPk(token.id)
    if (!user) {
      return res.status(401).json({ error: 'invalid token' })
    }

    req.user = user // Attach the user object to req
    next()
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = userExtractor
