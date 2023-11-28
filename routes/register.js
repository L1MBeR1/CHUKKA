const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bd = require('../models/bd'); // Путь к вашему файлу bd.js

// bd.connect();
// Используем middleware bodyParser.urlencoded для обработки данных из формы
router.use(bodyParser.urlencoded({ extended: true }));
registrationMessage="";
// Роут для страницы регистрации (GET-запрос)
router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', async (req, res) => {
  try {
    
    // Извлекаем данные из тела запроса
    const { name, surname, patronymic, gender, phoneNumber, email, login, password } = req.body;

    // Выполняем SQL-запрос для вызова функции add_appuser
    const result = await bd.query('SELECT * FROM public.add_appuser($1, $2, $3, $4, $5, $6, $7, $8) AS result', [name, surname, patronymic, gender, phoneNumber, email, login, password]);
    // Извлекаем текстовый результат из результата SQL-запроса
    // const { message, success } = result[0].result;

    // console.log(result[0].result[2]);
    // Отправляем ответ клиенту с полученным текстовым результатом

    const { message, success } = result[0];

    console.log('Message:', message);
    // console.log('Success:', success);
    if (success){
      // res.render('register', { registrationMessage: message})
      setTimeout(function() {
        res.redirect('/');;
      }, 1500);
    }else {
      res.render('register', { registrationMessage: message})
    }
  

  } catch (error) {
    console.error('Ошибка регистрации:', error);

    // Устанавливаем переменную для сообщения об ошибке
    res.locals.errorMessage = 'Произошла ошибка в процессе регистрации.';
    // Рендерим страницу регистрации с сообщением об ошибке
    res.render('register', { registrationMessage: res.locals.errorMessage});
  }
});
module.exports = router;