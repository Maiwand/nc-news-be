const { request, response } = require("../app");
const {
  selectAllArticles,
  selectArticleById,
} = require("../models/articles.model");

const getAllArticles = (request, response) => {
  selectAllArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

module.exports = { getAllArticles, getArticleById };
