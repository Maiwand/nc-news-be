const { selectArticleById } = require("../models/articles.model");
const { selectCommentsByArticleId } = require("../models/comments.model");

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  selectArticleById(article_id)
    .then(() => selectCommentsByArticleId(article_id))
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

module.exports = { getCommentsByArticleId };
