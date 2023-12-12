const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bd = require('../models/bd'); // Путь к вашему файлу bd.js

// bd.connect();
// Используем middleware bodyParser.urlencoded для обработки данных из формы
router.use(bodyParser.urlencoded({ extended: true }));
registrationMessage="";
var user =''
// Роут для страницы регистрации (GET-запрос)
router.get('/', (req, res) => {

   if (req.session.user ) {
    user =req.session.user.login;
    const { login, role } = req.session.user;
    console.log(req.session.user)

    res.render('catalog');
  } else {

    res.redirect('/login');
  }
});
router.post('/logout', (req, res) => {
  // Логика для функции 1
  req.session.destroy((err) => {
    if (err) {
      console.error('Ошибка выхода из сессии:', err);
      res.status(500).send('Internal Server Error');
    } else {
      setTimeout(function() {
        res.status(200).send('OK');
      }, 1500);
    }
  });
});
router.get('/loadData', async (req, res) => {
  try {
    const { category } = req.query; // Изменение на req.query
    console.log(req.query);
      // Вызов функции в зависимости от категории
      const data = await getDataByCategory(category);

      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Динамическое выполнение функции в зависимости от категории
async function getDataByCategory(category) {
  console.log(category)
  switch (category) {
      case 'Бренды':
          return await bd.query('SELECT * FROM public.brand ORDER BY id_brand ASC ');
      // Добавьте другие категории и соответствующие запросы
      case 'Список обуви':
          return await bd.query('SELECT * from public.get_shoe_info() ORDER BY id_shoe ASC ');
      case 'Высокооценённая обувь':
        return await bd.query('SELECT * FROM get_highest_rated_shoes(); ');
      case 'Обувь со скидкой':
        return await bd.query('SELECT * FROM get_discounted_shoes_forClient();');
      case 'Мои заказы':
        return await bd.query('SELECT * FROM get_user_orders($1)',[user]);
      case 'Корзина':
          return await bd.query('SELECT * FROM public.get_unordered_bucket_rows_for_user($1) ORDER BY id_bucket_row ASC ',[user]);
      default:
          throw new Error('Неизвестная категория');
  }
}
router.get('/getBestsellers/:sd/:ed', async (req, res) => {
  try {
    const { sd,ed } = req.params;
      const data = await bd.query('SELECT * FROM get_best_selling_shoes($1, $2)ORDER BY order_count DESC;',[sd,ed]);
      console.log(data);
      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/getNewShoe/:sd/:ed', async (req, res) => {
  try {
    const { sd,ed } = req.params;
      const data = await bd.query('SELECT * FROM public.get_shoes_by_receipt_date($1, $2);',[sd,ed]);
      console.log(data);
      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/getReviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
      const data = await bd.query('SELECT * FROM public.get_reviews_by_shoe_id($1);',[id]);
      // console.log(data);
      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/addReview', async (req, res) => {
  try {
    const { text,rating,date,time,id_shoe } = req.body;
    console.log(req.body);
    // Ваш код для вставки данных в базу данных
    // Например, используя ваш модуль работы с базой данных (bd.js)
    const result = await bd.query('SELECT * FROM add_review_forclient($1, $2,$3, $4,$5,$6);',[user,text,rating,date,time,id_shoe]);
    const { message, success } = result[0];
    console.log(message);
    if (success) {
      res.status(201).json({ message: 'Отзыв успешно добавлен', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении' });
  }
});
router.post('/addbacket', async (req, res) => {
  try {
    const { model_name,amount,size } = req.body;
    console.log(req.body);

    // Ваш код для вставки данных в базу данных
    // Например, используя ваш модуль работы с базой данных (bd.js)
    const result = await bd.query('SELECT * FROM add_bucket_row($1, $2,$3, $4);',[user,model_name,amount,size]);
    const { message, success } = result[0];
    console.log(message);
    if (success) {
      res.status(201).json({ message: 'Товар успешно добавлен в корзину', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении' });
  }
});
router.delete('/removeBucket/:id', async (req, res) => {
  try {
    console.log(req.params)
    const {  id } = req.params;
    bd.query(`DELETE FROM public.bucket_row WHERE id_bucket_row = $1`, [id]);
    res.status(200).json({ message: 'Запись успешно удалена.' });
  } catch (error) {
    console.error('Ошибка удаления данных:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/updateBucket/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    // Проверка, что обязательные данные переданы
    console.log(req.body);
    console.log(req.params);

    const result = await bd.query(
      'SELECT * FROM public.update_bucket_row_quantity($1, $2) AS result',[id, amount]
    );

    const { message, success } = result[0];

    if (success) {
      res.status(201).json({ message: 'Строка успешно измененина', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при изменении:', error);
    res.status(500).json({ error: 'Произошла ошибка при изменении' });
  }
});
router.put('/updateOrder/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cost,date,time,delivery_method,adress } = req.body;

    // Проверка, что обязательные данные переданы
    console.log(req.body);
    console.log(req.params);

    const result = await bd.query(
      'SELECT * FROM public.update_and_create_order($1, $2,$3,$4,$5,$6)',[id, cost,date,time,delivery_method,adress]
    );

    const { message, success } = result[0];

    if (success) {
      res.status(201).json({ message: 'Заказ успешно сформирован', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при изменении:', error);
    res.status(500).json({ error: 'Произошла ошибка при изменении' });
  }
});
router.put('/updateBucket_rows', async (req, res) => {
  try {
    const rows = req.body; // Ваш массив объектов
    const query = 'SELECT * FROM public.update_bucket_row_and_set_ordered($1);';

    // Массив промисов запросов
    const queryPromises = rows.map(row => {
      return new Promise((resolve, reject) => {
        bd.query(query, [row.id_bucket_row]) // Используйте свойство объекта, которое представляет айди строки
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            console.error('Ошибка при обновлении данных в базе данных:', err);
            reject(err);
          });
      });
    });

    // Ждем выполнения всех запросов
    await Promise.all(queryPromises);

    // Если мы дошли до этой точки, значит все запросы выполнены успешно
    res.status(200).json({ success: true, message: 'Данные успешно обновлены в базе данных.' });
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
    res.status(500).json({ success: false, message: 'Произошла ошибка при обновлении данных.' });
  }
});
router.put('/updateOLDBucket_rows/:id', async (req, res) => {
  try {
    const { id } = req.params;


    // Проверка, что обязательные данные переданы
    console.log(req.body);


    const result = await bd.query(
      'SELECT * FROM public.move_unordered_rows_to_existing_or_new_order($1)',[id]
    );

    const { message, success } = result[0];

    if (success) {
      res.status(201).json({ message: 'Заказ успешно сформирован', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при изменении:', error);
    res.status(500).json({ error: 'Произошла ошибка при изменении' });
  }
});
router.get('/getOrderList/:id', async (req, res) => {
  try {
    const { id } = req.params;
      const data = await bd.query('SELECT * FROM public.get_ordered_bucket_rows_for_order($1);',[id]);
      // console.log(data);
      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
