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

const selectAllArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortColumns = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_id",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by column" });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const queryValues = [];
  let queryString = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author,
           articles.created_at, articles.votes, articles.article_img_url,
           COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id   
  `;
  if (topic) {
    queryString += "WHERE topic = $1";
    queryValues.push(topic);
  }

  queryString += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
  `;

  return db.query(queryString, queryValues).then(({ rows }) => rows);
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

const updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

module.exports = {
  selectAllArticles,
  selectArticleById,
  updateArticleById,
  checkArticleExists,
};
