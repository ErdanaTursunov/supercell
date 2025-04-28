// routes/cartItemsRoutes.js
const express = require("express");
const routerCartItems = express.Router();
const cartItemsController = require("../controllers/cartItemsController");
const authMiddleware = require("../middleware/authMiddleware");

routerCartItems.post("/", authMiddleware, cartItemsController.addCartItem);
routerCartItems.get("/", authMiddleware, cartItemsController.getCartItemsByUserId);
routerCartItems.delete("/:id", authMiddleware, cartItemsController.deleteCartItem);
routerCartItems.put("/:id", authMiddleware, cartItemsController.updateCartItemQuantity); // New PUT endpoint

module.exports = routerCartItems;