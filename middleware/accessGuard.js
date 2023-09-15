const { Session } = require('../models')

// Check for disabled user status & verify session
const accessGuard = async (req, res, next) => {
  const { disabled } = req.user // Assuming userExtractor middleware has run
  if (disabled) {
    return res.status(403).json({ error: 'Account disabled.' })
  }

  try {
    const session = await Session.findOne({
      where: {
        userId: req.decodedToken.id,
      },
    })

    if (!session) {
      return res.status(401).json({ error: 'No active session found.' })
    }
    // Session exists and is valid, store session data in req.session
    req.session = session

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = accessGuard
