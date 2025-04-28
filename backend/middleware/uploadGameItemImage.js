// middlewares/uploadGameItems.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Папка для изображений GameItems
const gameItemsImagesDir = path.join(__dirname, '..', 'public', 'images', 'gameItems');
if (!fs.existsSync(gameItemsImagesDir)) {
  fs.mkdirSync(gameItemsImagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, gameItemsImagesDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Можно загружать только изображения!'), false);
  }
};

const uploadGameItemImage = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = uploadGameItemImage;
