const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  const status = error.status || 400
  res.status(status).send(error.message)
}

module.exports = errorHandler
