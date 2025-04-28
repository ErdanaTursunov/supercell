// controllers/cartItemsController.js
const db = require("../models");

const addCartItem = async (req, res) => {
  try {
    const { gameItemId, quantity } = req.body;
    const userId = req.user.id; // Предполагаем, что ID пользователя передаётся через middleware (например, через authMiddleware)
    
    // Проверяем, существует ли товар с таким ID
    const gameItem = await db.GameItems.findByPk(gameItemId);
    if (!gameItem) {
      return res.status(404).json({ message: "Game item not found" });
    }
    
    // Создаём или обновляем товар в корзине (если он уже есть)
    const [cartItem, created] = await db.CartItems.findOrCreate({
      where: { userId, gameItemId },
      defaults: { quantity },
      include: [
        {
          model: db.GameItems,
          include: [
            {
              model: db.GameItemDetails
            }
          ]
        }
      ]
    });
    
    if (!created) {
      // Если товар уже есть в корзине, то просто обновим его количество
      cartItem.quantity += quantity;
      await cartItem.save();
    }
    
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartItemsByUserId = async (req, res) => {
  try {
    const userId = req.user.id; // Берём ID пользователя из middleware
    const cartItems = await db.CartItems.findAll({
      where: { userId },
      include: [
        {
          model: db.GameItems,
          include: [
            {
              model: db.GameItemDetails
            }
          ]
        }
      ] // Включаем информацию о товаре
    });
    
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await db.CartItems.findByPk(id);
    
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    await cartItem.destroy();
    res.json({ message: "Cart item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New controller method to update cart item quantity
const updateCartItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;
    
    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }
    
    // Find the cart item
    const cartItem = await db.CartItems.findOne({
      where: { id, userId }, // Ensure the item belongs to the authenticated user
      include: [
        {
          model: db.GameItems,
          include: [
            {
              model: db.GameItemDetails
            }
          ]
        }
      ]
    });
    
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found or does not belong to user" });
    }
    
    // Update the quantity
    cartItem.quantity = quantity;
    await cartItem.save();
    
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addCartItem,
  getCartItemsByUserId,
  deleteCartItem,
  updateCartItemQuantity // Add the new method to exports
};