
const express = require('express');
const path = require('path');
// const db = require('./models/db');  // Предполагается, что ваш файл db.js находится в директории models

const app = express();
const port = process.env.PORT || 3001;

// Указываем Express использовать директорию 'views' для представлений
app.set('views', path.join(__dirname, 'views'));

// Указываем Express использовать шаблонизатор EJS
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Маршруты
const homeRoute = require('./routes/home');
const registerRoute = require('./routes/register');

app.use('/', homeRoute);
app.use('/register', registerRoute);
// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

