const express = require("express");
const authController = require("../controllers/authController");

const routerLogin = express.Router();

routerLogin.post("/register", authController.register)
routerLogin.post("/login", authController.login)

module.exports = routerLogin;