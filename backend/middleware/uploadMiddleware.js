const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Создаем директорию для хранения изображений, если она не существует
const newsImagesDir = path.join(__dirname, '..', 'public', 'images', 'news');
if (!fs.existsSync(newsImagesDir)) {
  fs.mkdirSync(newsImagesDir, { recursive: true });
}

// Настройка хранилища для загруженных файлов
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, newsImagesDir);
  },
  filename: function(req, file, cb) {
    // Генерируем уникальное имя файла с добавлением текущей даты
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Фильтр для проверки типа файлов
const fileFilter = (req, file, cb) => {
  // Принимаем только изображения
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Можно загружать только изображения!'), false);
  }
};

// Создаем middleware для загрузки файлов
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Максимальный размер файла: 5MB
});

module.exports = upload;