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
   // Проверяем, есть ли информация о пользователе в сессии
   if (req.session.user && req.session.user.userType =='Администратор') {
    // Достаем данные пользователя из сессии
    const { login, role } = req.session.user;
    console.log(req.session.user)
    // Используем данные пользователя в рендере страницы или в логике обработки запроса
    res.render('admin', { login, role });
  } else {
    // Если нет информации, перенаправляем на страницу входа
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
      case 'Обувь':
          return await bd.query('SELECT * from public.get_shoe_info() ORDER BY id_shoe ASC ');
      case 'Отзывы':
          return await bd.query('SELECT * FROM public.get_reviews_info();');
      case 'Обувь со скидкой':
        return await bd.query('SELECT * FROM public.get_discounted_shoes_info();');
      case 'Пользователи':
        return await bd.query('SELECT * FROM public.appuser ORDER BY id_user  ASC ');
      case 'Заказы':
        return await bd.query('SELECT* from public.get_order_info() ORDER BY id_order ASC ');
      case 'Скидки':
        return await bd.query('SELECT * FROM public.sale ORDER BY id_sale ASC ');
      case 'Размеры':
        return await bd.query('SELECT * FROM public.get_shoe_sizes_info();');
      case 'Строки корзины':
          return await bd.query('SELECT * FROM public.get_bucket_rows_info() ORDER BY id_bucket_row ASC ');
      default:
          throw new Error('Неизвестная категория');
  }
}
router.delete('/removeData/:category/:id', async (req, res) => {
  try {
    console.log(req.params)
    const { category, id } = req.params;
    await removeDataByCategory(category, id);
    res.status(200).json({ message: 'Запись успешно удалена.' });
  } catch (error) {
    console.error('Ошибка удаления данных:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
async function removeDataByCategory(category, id) {
  console.log(category,id)
  try {
    switch (category) {
      case 'brand': // Исправлено на правильное значение
        await bd.query(`DELETE FROM public.brand WHERE id_brand = $1`, [id]);
        break;
      case 'appuser':
          await bd.query(`DELETE FROM public.appuser WHERE id_user = $1`, [id]);
          break;
      case 'discounted_shoes':
          await bd.query(`DELETE FROM public.discounted_shoes WHERE id_discounted_shoes = $1`, [id]);
          break;
      case 'review':
          await bd.query(`DELETE FROM public.review WHERE id_review = $1`, [id]);
          break;
      case 'sale':
          await bd.query(`DELETE FROM public.sale WHERE id_sale = $1`, [id]);
          break;
      case 'shoe':
          await bd.query(`DELETE FROM public.shoe WHERE id_shoe = $1`, [id]);
          break;
      case 'size':
          await bd.query(`DELETE FROM public.size WHERE id_size = $1`, [id]);
          break;
      case 'user_order':
          await bd.query(`DELETE FROM public.user_order WHERE id_order = $1`, [id]);
      case 'bucket_row':
            await bd.query(`DELETE FROM public.bucket_row WHERE id_bucket_row = $1`, [id]);
        break;
      // Добавьте дополнительные кейсы для других категорий
      default:
        throw new Error('Неизвестная категория для удаления данных');
    }
  } catch (error) {
    throw error;
  }
}



router.post('/addbrand', async (req, res) => {
  try {
    const { name, description } = req.body;

    // Проверка, что обязательные данные переданы

    await bd.query('INSERT INTO public.brand (name, description) VALUES ($1, $2);', [name, description]);
    res.status(201).json({ message: 'Бренд успешно добавлен' });
  } catch (error) {
    console.error('Ошибка при добавлении бренда:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении бренда' });
  }
});

router.put('/updatebrand/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    console.log(req.params);
    console.log(req.body);
    // Проверка наличия обязательных данных
    if (!name || !description) {
      return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
    }

    // Обновление данных бренда в базе данных
    await bd.query('UPDATE public.brand SET name=$1, description=$2 WHERE id_brand=$3', [name, description, id]);

    res.status(200).json({ message: 'Данные бренда успешно обновлены' });
  } catch (error) {
    console.error('Ошибка обновления данных бренда:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/addsale', async (req, res) => {
  try {
    const { value, description,start_date,end_date} = req.body;

    // Проверка, что обязательные данные переданы
    console.log(req.body);
    await bd.query('INSERT INTO public.sale (value, description, start_date, end_date) VALUES ($1, $2, $3, $4)', [value, description, start_date, end_date]);

    
    res.status(201).json({ message: 'Скидка успешно добавлена' });
  } catch (error) {
    console.error('Ошибка при добавлении скидки:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении бренда' });
  }
});
router.put('/updatesale/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value, description, start_date, end_date } = req.body;

    // Проверка, что обязательные данные переданы
    console.log(req.body);
    console.log(req.params);

    await bd.query('UPDATE public.sale SET value=$1, description=$2, start_date=$3, end_date=$4 WHERE id_sale=$5',[value, description, start_date, end_date, id]);

    res.status(200).json({ message: 'Скидка успешно обновлена' });
  } catch (error) {
    console.error('Ошибка при обновлении скидки:', error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении скидки' });
  }
});

router.post('/addappuser', async (req, res) => {
  try {
    const { name, surname, patronymic, gender,phone_number, email, login, password, user_type } = req.body;
    console.log(req.body);
    // Ваш код для вставки данных в базу данных
    // Например, используя ваш модуль работы с базой данных (bd.js)
    const result = await bd.query('SELECT * FROM public.add_appuserForAdmin($1, $2, $3, $4, $5, $6, $7, $8,$9) AS result',[name, surname, patronymic, gender,phone_number, email, login, password, user_type]);
    const { message, success }  = result[0]
    
    if (success) {
      res.status(201).json({ message: 'Пользователь успешно добавлен', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении пользователя' });
  }
});
router.put('/updateappuser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, patronymic, gender, phone_number, email, login, password, user_type } = req.body;
    console.log(req.body);
    console.log(req.params);
    // Ваш код для выполнения запроса к функции в базе данных
    const result = await bd.query(
      'SELECT * FROM public.upd_appuser($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) AS result',
      [id, name, surname, patronymic, gender, phone_number, email, login, password, user_type]
    );

    const { message, success } = result[0];

    if (success) {
      res.status(201).json({ message: 'Пользователь успешно добавлен', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении пользователя' });
  }
});



router.get('/getShoesNames', async (req, res) => {
  try {
      const data = await bd.query('SELECT * FROM public.get_shoes_without_discount();');
      console.log(data);
      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/getSalesNames', async (req, res) => {
  try {
      const data = await bd.query('SELECT * FROM public.get_discount_descriptions();');
      console.log(data);
      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/addDiscounted_shoesData', async (req, res) => {
  try {
    const { shoe,sale } = req.body;
    console.log(req.body);
    // Ваш код для вставки данных в базу данных
    // Например, используя ваш модуль работы с базой данных (bd.js)
    const result = await bd.query('SELECT *from public.create_discounted_shoes($1, $2)',[shoe, sale]);
    const { message, success } = result[0];
    console.log(message);
    if (success) {
      res.status(201).json({ message: 'Скидка успешно добавлен для обуви', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при скидки:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении скидки' });
  }
});

router.get('/getShoesDefaultNames', async (req, res) => {
  try {
      const data = await bd.query('SELECT * FROM public.get_model_names();');
      console.log(data);
      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/addsize', async (req, res) => {
  try {
    const { shoe,size } = req.body;
    console.log(req.body);
    // Ваш код для вставки данных в базу данных
    // Например, используя ваш модуль работы с базой данных (bd.js)
    const result = await bd.query('SELECT * FROM public.create_shoe_size($1, $2);',[shoe, size]);
    const { message, success } = result[0];
    console.log(message);
    if (success) {
      res.status(201).json({ message: 'Размер успешно добавлен для обуви', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при Размер:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении скидки' });
  }
});
router.get('/getUsersLogin', async (req, res) => {
  try {
      const data = await bd.query('SELECT login FROM appuser ');
      console.log(data);
      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/addUser_order', async (req, res) => {
  try {
    const { user_login,data,time,delivery_method,adress } = req.body;
    console.log(req.body);
    // Ваш код для вставки данных в базу данных
    // Например, используя ваш модуль работы с базой данных (bd.js)
    const result = await bd.query('SELECT * FROM public.add_order($1, $2,$3, $4,$5);',[user_login,data,time,delivery_method,adress]);
    const { message, success } = result[0];
    console.log(message);
    if (success) {
      res.status(201).json({ message: 'Заказ успешно добавлен', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении' });
  }
});
router.put('/updUser_order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {  user_login,data,time,delivery_method,adress } = req.body;
    console.log(req.body);
    console.log(req.params);
    // Ваш код для выполнения запроса к функции в базе данных
    const result = await bd.query(
      'SELECT * FROM public.update_order($1, $2, $3, $4, $5, $6) AS result',
      [id,  user_login,data,time,delivery_method,adress]
    );

    const { message, success } = result[0];

    if (success) {
      res.status(201).json({ message: 'Заказ успешно добавлен', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при добавлении заказа:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении заказа' });
  }
});
router.get('/getBrands', async (req, res) => {
  try {
      const data = await bd.query('SELECT name FROM brand ');
      console.log(data);
      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/addShoe', async (req, res) => {
  try {
    const { name,model_type,brand,date,description,cost,gender,childrens,color } = req.body;
    console.log(req.body);
    // Ваш код для вставки данных в базу данных
    // Например, используя ваш модуль работы с базой данных (bd.js)
    const result = await bd.query('SELECT * FROM public.add_shoe($1, $2,$3, $4,$5,$6, $7,$8, $9);',[name,model_type,brand,date,description,cost,gender,childrens,color]);
    const { message, success } = result[0];
    console.log(result[0]);
    if (success) {
      res.status(201).json({ message: 'Обувь успешно добавлена', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении' });
  }
});
// router.get('/GetShoeId/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = await bd.query('SELECT id_shoe FROM public.shoe WHERE model_name = $1', [id]);
//     console.log(data);
//     res.json(data);
//   } catch (error) {
//     console.error('Ошибка загрузки данных:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




router.post('/addSizes', async (req, res) => {
  try {
    const { name, selectedSizesArray } = req.body;

    const query = 'SELECT * FROM public.create_shoe_size($1, $2);';

    // Массив промисов запросов
    const queryPromises = selectedSizesArray.map(size => {
      return new Promise((resolve, reject) => {
        bd.query(query, [name, size])
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            console.error('Ошибка при добавлении размера в базу данных:', err);
            reject(err);
          });
      });
    });

    // Ждем выполнения всех запросов
    await Promise.all(queryPromises);

    // Если мы дошли до этой точки, значит все запросы выполнены успешно
    res.status(200).json({ success: true, message: 'Размеры успешно добавлены в базу данных.' });
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
    res.status(500).json({ success: false, message: 'Произошла ошибка при добавлении размеров.' });
  }
});
router.get('/getSizes/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const data = await bd.query('SELECT * FROM size WHERE id_shoe = $1;',[id]);
      console.log(data);
      res.json(data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/UpdateShoe/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name,model_type,brand,date,description,cost,gender,childrens,color } = req.body;
    console.log(req.body);
    // Ваш код для вставки данных в базу данных
    // Например, используя ваш модуль работы с базой данных (bd.js)
    const result = await bd.query('SELECT * FROM public.update_shoe($1, $2,$3, $4,$5,$6, $7,$8, $9,$10);',[id,name,model_type,brand,date,description,cost,gender,childrens,color]);
    const { message, success } = result[0];
    console.log(result[0]);
    if (success) {
      res.status(201).json({ message: 'Обувь успешно добавлена', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении' });
  }
});
router.put('/UpdateSizes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name,selectedSizesArray } = req.body;
    bd.query('SELECT * FROM public.delete_shoe_sizes($1);',[id]);
    const query = 'SELECT * FROM public.create_shoe_size($1, $2);';
    if (!selectedSizesArray.length==0){
      const queryPromises = selectedSizesArray.map(size => {
        return new Promise((resolve, reject) => {
          bd.query(query, [name, size])
            .then(result => {
              resolve(result);
            })
            .catch(err => {
              console.error('Ошибка при добавлении размера в базу данных:', err);
              reject(err);
            });
        });
      });
  
      // Ждем выполнения всех запросов
      await Promise.all(queryPromises);
  
      // Если мы дошли до этой точки, значит все запросы выполнены успешно
      res.status(200).json({ success: true, message: 'Размеры успешно добавлены в базу данных.' });
    }else{
      res.status(200).json({ success: true, message: 'Размеры успешно добавлены в базу данных.' });
    }
    // Массив промисов запросов
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
    res.status(500).json({ success: false, message: 'Произошла ошибка при добавлении размеров.' });
  }
});
router.post('/addReview', async (req, res) => {
  try {
    const { model_name,user,text,rating,date,time} = req.body;
    console.log(req.body);
    // Ваш код для вставки данных в базу данных
    // Например, используя ваш модуль работы с базой данных (bd.js)
    const result = await bd.query('SELECT * FROM public.add_review($1, $2,$3, $4,$5,$6);',[model_name,user,text,rating,date,time]);
    const { message, success } = result[0];
    console.log(result[0]);
    if (success) {
      res.status(201).json({ message: 'Отзыв успешно добавлена', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении' });
  }
});
router.put('/UpdateReview/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { model_name,user,text,rating,date,time } = req.body;
    console.log(req.body);
    // Ваш код для вставки данных в базу данных
    // Например, используя ваш модуль работы с базой данных (bd.js)
    const result = await bd.query('SELECT * FROM public.update_review($1, $2,$3, $4,$5,$6, $7);',[id,model_name,user,text,rating,date,time]);
    const { message, success } = result[0];
    console.log(result[0]);
    if (success) {
      res.status(201).json({ message: 'Отзыв успешно обнавлен', success: true });
    } else {
      res.status(400).json({ message, success: false });
    }
  } catch (error) {
    console.error('Ошибка при обнавлении:', error);
    res.status(500).json({ error: 'Произошла ошибка при обнавлении' });
  }
});
module.exports = router;
