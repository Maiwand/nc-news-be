const db = require("../db/connection");

const selectTopics = () => {
  return db.query("SELECT slug, description FROM topics;").then(({ rows }) => {
    return rows;
  });
};

module.exports = { selectTopics };
