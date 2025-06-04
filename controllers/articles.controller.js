const { selectAllArticles } = require("../models/articles.model");

const getAllArticles = (request, response) => {
  selectAllArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

module.exports = { getAllArticles };
