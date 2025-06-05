const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controller");
const { getAllArticles } = require("./controllers/articles.controller");
const { getAllUsers } = require("./controllers/users.controller");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerError,
} = require("./errors");

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/users", getAllUsers);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerError);

module.exports = app;
