const sequelize = require("../db");
const Users = require("./Users");
const News = require("./News");
const GameItems = require("./GameItems");
const CartItems = require("./CartItems"); // Carts мы убрали
const GameItemDetails = require("./GameItemDetails");

const db = {
    GameItems,
    CartItems,
    Users,
    sequelize,
    News,
    GameItemDetails,
};

// Связи:

// Один пользователь может иметь много товаров в корзине
Users.hasMany(CartItems, { foreignKey: "userId" });
CartItems.belongsTo(Users, { foreignKey: "userId" });

// Один товар может быть в многих корзинах
GameItems.hasMany(CartItems, { foreignKey: "gameItemId" });
CartItems.belongsTo(GameItems, { foreignKey: "gameItemId" });

// Один товар имеет одни детали
GameItems.hasOne(GameItemDetails, { foreignKey: "gameItemId" });
GameItemDetails.belongsTo(GameItems, { foreignKey: "gameItemId" });

module.exports = db;
