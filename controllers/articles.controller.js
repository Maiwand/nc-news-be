const {
  selectAllArticles,
  selectArticleById,
  updateArticleById,
  checkArticleExists,
} = require("../models/articles.model");

const getAllArticles = (request, response, next) => {
  const { sort_by, order } = request.query;
  selectAllArticles(sort_by, order)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

const patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "Invalid inc_votes format" });
  }

  Promise.all([
    checkArticleExists(article_id),
    updateArticleById(article_id, inc_votes),
  ])
    .then(([, updatedArticle]) => {
      response.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

module.exports = { getAllArticles, getArticleById, patchArticleById };
