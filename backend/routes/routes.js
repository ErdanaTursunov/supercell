const express = require("express");
const routerLogin = require("./routerLogin");
const routerUsers = require("./routerUsers");
const routerNews = require("./routerNews");
const routerCartItems = require("./routerCartItems");
const routerGameItems = require("./routerGameItems");
const router = express.Router();

router.use("/auth", routerLogin)
router.use("/users", routerUsers)
router.use("/news", routerNews)
router.use("/cart/items", routerCartItems)
router.use("/game/items", routerGameItems)

module.exports = router;