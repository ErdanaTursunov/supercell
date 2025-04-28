const express = require("express");
const UsersController = require("../controllers/usersController");

const routerUsers = express.Router();

routerUsers.get("/", UsersController.get)
routerUsers.get("/:id", UsersController.getAll)
routerUsers.put("/:id", UsersController.put)
routerUsers.delete("/:id", UsersController.delete)

module.exports = routerUsers;