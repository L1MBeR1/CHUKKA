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
  res.render('login');
});
router.post('/', async (req, res) => {
  try {
    
    // Извлекаем данные из тела запроса
    const { login, password } = req.body;

    // Выполняем SQL-запрос для вызова функции add_appuser
    const result = await bd.query('SELECT * FROM public.authenticate_user($1, $2) AS result', [login, password]);
    // Извлекаем текстовый результат из результата SQL-запроса
    const message = result[0].message;
    const success = result[0].success;
    const userType = result[0].user_type;
    // console.log(result);
    // Отправляем ответ клиенту с полученным текстовым результатом

    // const { message, success } = result[0];

    // console.log(result[0]);
    // console.log('Success:', success);
    if (success){
      // res.render('register', { registrationMessage: message})
      // console.log(userType)
      req.session.user = {
        login,
        password,
        userType,
      };
      console.log(req.session.user)
      setTimeout(function() {
        if (userType=='Клиент'){
          res.redirect('/catalog');
        }
        if (userType=='Администратор'){
          res.redirect('/admin');
        }
        
      }, 1500);
    }else {
      res.render('login', { registrationMessage: message})
    }
  

  } catch (error) {
    console.error('Ошибка входа в аккаунт:', error);

    // Устанавливаем переменную для сообщения об ошибке
    res.locals.errorMessage = 'Произошла ошибка в процессе входа.';
    // Рендерим страницу регистрации с сообщением об ошибке
    res.render('login', { registrationMessage: res.locals.errorMessage});
  }
});
module.exports = router;