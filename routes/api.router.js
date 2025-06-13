const apiRouter = require("express").Router();
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const usersRouter = require("./users.router");
const topicsRouter = require("./topics.router");
const endpoints = require("../endpoints.json");
const express = require("express");

apiRouter.use("/", express.static("public"));

apiRouter.get("/json", (req, res) => {
  res.status(200).send({ endpoints });
});

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
