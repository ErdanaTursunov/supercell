const Router = require('express');
const routerNews = new Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Только админ может добавлять новости
// Используем upload.array для загрузки нескольких файлов, максимум 10
routerNews.post('/', authMiddleware, adminMiddleware, upload.array('images', 10), newsController.create);

// Все пользователи могут смотреть новости
routerNews.get('/', newsController.getAll);

// Получение одной новости по ID
routerNews.get('/:id', newsController.getOne);

// Админ может обновить новость
routerNews.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 10), newsController.update);

// Админ может удалить новость
routerNews.delete('/:id', authMiddleware, adminMiddleware, newsController.delete);

module.exports = routerNews;