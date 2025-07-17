module.exports = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  const message =
    statusCode === 500 ? "An internal server error occurred" : err.message;

  res.status(statusCode).send({ message });
};
