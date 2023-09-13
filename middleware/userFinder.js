/* attach user to req.user by id
  exclude passwordHash from response
*/
const userFinder = async (req, res, next) => {
  const { id } = req.params
  req.user = await User.findByPk(id, {
    attributes: {
      exclude: ['passwordHash'],
    },
  })

  next()
}

module.exports = userFinder
