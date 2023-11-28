const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const bd = require('./models/bd'); // Путь к вашему файлу bd.js
bd.connect();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;

// Указываем Express использовать директорию 'views' для представлений
app.set('views', path.join(__dirname, 'views'));

// Указываем Express использовать шаблонизатор EJS
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

const secretKey = crypto.randomBytes(64).toString('hex');
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  })
);


// Маршруты
const homeRoute = require('./routes/home');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const adminRoute = require('./routes/admin');

app.use('/', homeRoute);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/admin', adminRoute);
// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});