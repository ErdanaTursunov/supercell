// errorMiddleware.js
module.exports = function(err, req, res, next) {
    if (err instanceof multer.MulterError) {
      // Ошибка Multer при загрузке файла
      let message = "Ошибка при загрузке файла";
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = "Файл слишком большой. Максимальный размер 5MB";
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        message = "Превышено максимальное количество файлов";
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        message = "Неожиданный файл";
      }
      return res.status(400).json({ message });
    }
    
    // Другие ошибки
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Произошла непредвиденная ошибка на сервере" });
  };