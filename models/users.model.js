const db = require("../db/connection");

const checkUserExists = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
    });
};

const selectAllUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users;")
    .then(({ rows }) => rows);
};

const selectUserByUsername = (username) => {
  return db
    .query(
      "SELECT username, avatar_url, name FROM users WHERE username = $1;",
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return rows[0];
    });
};

module.exports = { selectAllUsers, checkUserExists, selectUserByUsername };
