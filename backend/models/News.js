const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const News = sequelize.define('News', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.ARRAY(DataTypes.STRING),  // Обновили поле, чтобы хранить массив строк
        allowNull: true,
    },
    game: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = News;
