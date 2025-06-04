const { selectAllUsers } = require("../models/users.model");

const getAllUsers = (request, response) => {
  selectAllUsers().then((users) => {
    response.status(200).send({ users });
  });
};

module.exports = { getAllUsers };
