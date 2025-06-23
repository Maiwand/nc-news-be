const express = require("express");
const app = express();

const cors = require("cors");

const {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerError,
} = require("./errors");

const apiRouter = require("./routes/api.router");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerError);

module.exports = app;
