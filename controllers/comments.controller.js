const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/comments.model");

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  selectArticleById(article_id)
    .then(() => selectCommentsByArticleId(article_id))
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

const postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;

  insertCommentByArticleId(article_id, newComment)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

module.exports = { getCommentsByArticleId, postCommentByArticleId };
