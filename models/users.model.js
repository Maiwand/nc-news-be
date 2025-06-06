const db = require("../db/connection");

const checkUserExists = (username) => {
  return db.query(`SELECT * FROM users WHERE username = $1`, [username]);
};

const selectAllUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users;")
    .then(({ rows }) => rows);
};

module.exports = { selectAllUsers, checkUserExists };
