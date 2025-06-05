const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controller");
const {
  getAllArticles,
  getArticleById,
} = require("./controllers/articles.controller");
const { getAllUsers } = require("./controllers/users.controller");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerError,
} = require("./errors");
const { getCommentsByArticleId } = require("./controllers/comments.controller");

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/users", getAllUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerError);

module.exports = app;
