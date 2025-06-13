const {
  selectAllUsers,
  selectUserByUsername,
} = require("../models/users.model");

const getAllUsers = (request, response, next) => {
  selectAllUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};

const getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  selectUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch(next);
};

module.exports = { getAllUsers, getUserByUsername };
