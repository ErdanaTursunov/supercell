const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Users = sequelize.define("Users", {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    Name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    LastName: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    role: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      defaultValue: "user" // По умолчанию обычный пользователь
    },
  }, { timestamps: false });
  
  
  module.exports = Users;
  