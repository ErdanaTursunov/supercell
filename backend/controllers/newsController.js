const db = require("../models");
const fs = require('fs');
const path = require('path');

class NewsController {
  // Создание новости
  async create(req, res) {
    try {
      const { title, subtitle, date, game } = req.body;
      
      // Обрабатываем загруженные файлы
      const imageArray = [];
      if (req.files && req.files.length > 0) {
        // Записываем пути к файлам
        req.files.forEach(file => {
          imageArray.push(`/images/news/${file.filename}`);
        });
      }
      
      const newsItem = await db.News.create({
        title,
        subtitle,
        date,
        image: imageArray, // Сохраняем массив путей к изображениям
        game
      });
      
      return res.status(201).json(newsItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка при создании новости" });
    }
  }

  // Получение всех новостей
  async getAll(req, res) {
    try {
      const news = await db.News.findAll({ order: [['date', 'DESC']] });
      return res.status(200).json(news);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка при получении новостей" });
    }
  }

  // Получение одной новости по ID
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const newsItem = await db.News.findByPk(id);
      
      if (!newsItem) {
        return res.status(404).json({ message: "Новость не найдена" });
      }
      
      return res.status(200).json(newsItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка при получении новости" });
    }
  }

  // Изменение новости
  async update(req, res) {
    try {
      const { id } = req.params; // Получаем id новости из URL
      const { title, subtitle, date, game } = req.body;
      
      const newsItem = await db.News.findByPk(id);
      if (!newsItem) {
        return res.status(404).json({ message: "Новость не найдена" });
      }
      
      // Обрабатываем загруженные файлы
      let imageArray = newsItem.image || [];
      
      // Если были загружены новые файлы
      if (req.files && req.files.length > 0) {
        // Если есть флаг для замены всех изображений
        if (req.body.replaceAllImages === 'true') {
          // Удаляем старые изображения
          if (newsItem.image && newsItem.image.length > 0) {
            newsItem.image.forEach(imgPath => {
              const imagePath = path.resolve(__dirname, '..', 'public', imgPath.replace(/^\//, '')); // Убираем начальный слеш
              if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Удаляем старое изображение с диска
              }
            });
          }
          
          // Записываем пути только к новым файлам
          imageArray = req.files.map(file => `/images/news/${file.filename}`);
        } else {
          // Добавляем новые файлы к существующим
          req.files.forEach(file => {
            imageArray.push(`/images/news/${file.filename}`);
          });
        }
      }
      
      // Если в запросе указаны изображения для удаления
      if (req.body.imagesToDelete) {
        const imagesToDelete = Array.isArray(req.body.imagesToDelete) 
          ? req.body.imagesToDelete 
          : [req.body.imagesToDelete];
        
        // Удаляем указанные изображения с диска
        imagesToDelete.forEach(imgPath => {
          const imagePath = path.resolve(__dirname, '..', 'public', imgPath.replace(/^\//, '')); // Убираем начальный слеш
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Удаляем изображение с диска
          }
        });
        
        // Обновляем массив изображений, исключая удаленные
        imageArray = imageArray.filter(img => !imagesToDelete.includes(img));
      }
      
      // Обновляем новость
      await newsItem.update({
        title,
        subtitle,
        date,
        image: imageArray, // Обновляем массив путей к изображениям
        game,
        category
      });
      
      return res.status(200).json(newsItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка при обновлении новости" });
    }
  }

  // Удаление новости
  async delete(req, res) {
    try {
      const { id } = req.params;
      const newsItem = await db.News.findByPk(id);
      
      if (!newsItem) {
        return res.status(404).json({ message: "Новость не найдена" });
      }
      
      // Удаляем изображения с сервера
      if (newsItem.image && newsItem.image.length > 0) {
        newsItem.image.forEach(imgPath => {
          const imagePath = path.resolve(__dirname, '..', 'public', imgPath.replace(/^\//, '')); // Убираем начальный слеш
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Удаляем изображение с диска
          }
        });
      }
      
      // Удаляем новость из базы данных
      await newsItem.destroy();
      return res.status(200).json({ message: "Новость успешно удалена" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка при удалении новости" });
    }
  }
}

module.exports = new NewsController();