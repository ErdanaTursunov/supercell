// routes/gameItemsRoutes.js
const express = require("express");
const routerGameItems = express.Router();
const uploadGameItemImage = require("../middleware/uploadGameItemImage");
const gameItemsController = require("../controllers/gameItemsController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

routerGameItems.post("/", authMiddleware, adminMiddleware, uploadGameItemImage.single('image'), gameItemsController.createGameItem);
routerGameItems.get("/",  gameItemsController.getAllGameItems);
routerGameItems.get("/:id",  gameItemsController.getGameItemById);
routerGameItems.delete("/:id", authMiddleware, adminMiddleware, gameItemsController.deleteGameItem);
routerGameItems.put("/:id", authMiddleware, adminMiddleware, uploadGameItemImage.single('image'), gameItemsController.updateGameItem);

module.exports = routerGameItems;
