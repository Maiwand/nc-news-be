const db = require("../db/connection");

const selectAllUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users;")
    .then(({ rows }) => rows);
};

module.exports = { selectAllUsers };
