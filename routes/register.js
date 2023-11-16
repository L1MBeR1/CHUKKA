const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// const db = require('./bd'); // Путь к вашему файлу bd.js

// Используем middleware bodyParser.urlencoded для обработки данных из формы
router.use(bodyParser.urlencoded({ extended: true }));

// Роут для страницы регистрации (GET-запрос)
router.get('/', (req, res) => {
  res.render('register');
});
module.exports = router;