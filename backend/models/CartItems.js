const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const CartItems = sequelize.define("CartItems", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gameItemId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: false
});

module.exports = CartItems;
