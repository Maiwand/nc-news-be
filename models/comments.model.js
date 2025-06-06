const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

const selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      SELECT comment_id, votes, created_at, author, body, article_id
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;
      `,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const insertCommentByArticleId = (article_id, newComment) => {
  const { username, body } = newComment;
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }

  const checkArticleExists = db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );

  const checkUserExists = db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  return Promise.all([checkArticleExists, checkUserExists]).then(
    ([checkArticleExistsResolved, checkUserExistsResolved]) => {
      if (checkArticleExistsResolved.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      if (checkUserExistsResolved.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }

      return db
        .query(
          `
        INSERT INTO comments (author, article_id, body)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
          [username, article_id, body]
        )
        .then(({ rows }) => rows[0]);
    }
  );
};

module.exports = { selectCommentsByArticleId, insertCommentByArticleId };
