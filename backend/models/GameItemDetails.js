const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const GameItemDetails = sequelize.define("GameItemDetails", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  gameItemId: { // связь с GameItems
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "GameItems",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: true 
  },
  gems: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  rarity: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  type: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
}, { timestamps: false, tableName: "GameItemDetails" });

module.exports = GameItemDetails;
