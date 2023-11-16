
const express = require('express');
const path = require('path');
// const db = require('./models/db');  // Предполагается, что ваш файл db.js находится в директории models

const app = express();
const port = process.env.PORT || 3001;

// Указываем Express использовать директорию 'views' для представлений
app.set('views', path.join(__dirname, 'views'));

// Указываем Express использовать шаблонизатор EJS
app.set('view engine', 'ejs');

// Маршруты
const homeRoute = require('./routes/home');
app.use('/', homeRoute);

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const express = require("express");
// const path = require("path");
// const app = express();
// const port = process.env.PORT || 3001;

// const homeRouter = require('./routes/home');


// app.use(express.static(path.join(__dirname, "public")));

// app.use('/', homeRouter);


// const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// server.keepAliveTimeout = 120 * 1000;
// server.headersTimeout = 120 * 1000;
