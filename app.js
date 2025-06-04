const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controller");
const { getAllArticles } = require("./controllers/articles.controller");
const { getAllUsers } = require("./controllers/users.controller");

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

module.exports = app;
