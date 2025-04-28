const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const GameItems = sequelize.define("GameItems", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  imageUrl: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  game: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
}, { timestamps: false,  tableName: "GameItems" });


module.exports = GameItems;
