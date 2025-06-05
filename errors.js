const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handlePSQLErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ["22P02"];

  if (psqlBadRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

const handleServerError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = { handleCustomErrors, handlePSQLErrors, handleServerError };
