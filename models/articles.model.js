const db = require("../db/connection");

const checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};

const selectAllArticles = () => {
  const queryString = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author,
           articles.created_at, articles.votes, articles.article_img_url,
           COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `;
  return db.query(queryString).then(({ rows }) => rows);
};

const selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `Article ${article_id} not found`,
        });
      }
      return article;
    });
};

module.exports = {
  selectAllArticles,
  selectArticleById,
  checkArticleExists,
};
