// controllers/gameItemsController.js
const GameItems = require("../models/GameItems");
const path = require("path");
const fs = require("fs");
const db = require("../models");

const createGameItem = async (req, res) => {
  const t = await db.sequelize.transaction(); // Транзакция
  try {
    const { name, description, game, details } = req.body;
    const imageUrl = req.file ? `/images/gameItems/${req.file.filename}` : null;

    // Создаём основной товар
    const newItem = await GameItems.create(
      { name, description, game, imageUrl },
      { transaction: t }
    );

    // Если в запросе есть доп. детали — создаём их
    if (details) {
      await db.GameItemDetails.create(
        {
          ...JSON.parse(details), // парсим строку в объект
          gameItemId: newItem.id  // привязываем к товару
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(201).json(newItem);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};


const getAllGameItems = async (req, res) => {
  try {
    const items = await GameItems.findAll({
      include: [{ model: db.GameItemDetails }]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGameItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GameItems.findByPk(id, {
      include: [{ model: db.GameItemDetails }]
    });
    if (!item) return res.status(404).json({ message: "Game item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGameItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GameItems.findByPk(id);
    if (!item) return res.status(404).json({ message: "Game item not found" });

    // Удаление файла изображения
    if (item.imageUrl) {
      const imagePath = path.join(__dirname, '..', 'public', item.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await item.destroy();
    res.json({ message: "Game item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateGameItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categories, game } = req.body;

    const item = await GameItems.findByPk(id);
    if (!item) return res.status(404).json({ message: "Game item not found" });

    // Если пришел новый файл, удаляем старую картинку
    if (req.file) {
      if (item.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', 'public', item.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      item.imageUrl = `/images/gameItems/${req.file.filename}`;
    }

    // Обновляем остальные поля
    item.name = name || item.name;
    item.description = description || item.description;
    item.categories = categories || item.categories;
    item.game = game || item.game;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createGameItem,
  getAllGameItems,
  getGameItemById,
  deleteGameItem,
  updateGameItem
};
