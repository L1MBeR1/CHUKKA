var choisenRowData=''
var choisenRow=''
var choisenCategory=''
var choisenC=''
var editB=document.querySelector('.edit')
document.getElementById('shoe').addEventListener('click', function(event) {
  editB.style.display = 'flex';
  choisenC='Обувь'
  loadData(choisenC);
  choiseItem(event.target)
});

document.getElementById('brand').addEventListener('click', function(event) {
  editB.style.display = 'flex';
  choisenC='Бренды'
  loadData(choisenC);
  choiseItem(event.target)
});
document.getElementById('review').addEventListener('click', function(event) {
  editB.style.display = 'flex';
  choisenC='Отзывы'
  loadData(choisenC);
  choiseItem(event.target)
});
document.getElementById('discounted_shoes').addEventListener('click', function(event) {
  editB.style.display = 'none';
 choisenC='Обувь со скидкой'
  loadData(choisenC);
  choiseItem(event.target)
});
document.getElementById('appuser').addEventListener('click', function(event) {
  editB.style.display = 'flex';
  choisenC='Пользователи'
  loadData(choisenC);
  choiseItem(event.target)
});
document.getElementById('user_order').addEventListener('click', function(event) {
  editB.style.display = 'flex';
  choisenC='Заказы'
  loadData(choisenC);
  choiseItem(event.target)
});
document.getElementById('sale').addEventListener('click', function(event) {
  editB.style.display = 'flex';
  choisenC='Скидки'
  loadData(choisenC);
  choiseItem(event.target)
});
document.getElementById('size').addEventListener('click', function(event) {

  editB.style.display = 'none';
  choisenC='Размеры'
  loadData(choisenC);
  choiseItem(event.target)
});
document.getElementById('bucket_row').addEventListener('click', function(event) {
  editB.style.display = 'flex';
  choisenC='Строки корзины'
  loadData(choisenC);
  choiseItem(event.target)
});
function choiseItem(item){
  if (item.classList.contains('menuItem')){
  var activeElements = document.querySelectorAll('.active');
  activeElements.forEach(function(element) {
    element.classList.remove('active');
  });

  // Добавляем класс "active" к текущему элементу
  item.classList.add('active');
  choisenCategory=item.id;
  console.log('ID элемента:', choisenCategory);
  }
  
}
function toggleOpacity() {
  var buttonContainer = document.querySelector('.buttonContainer');
            var currentOpacity = parseFloat(window.getComputedStyle(buttonContainer).opacity);
            console.log(currentOpacity)
            // Изменяем значение opacity
            if (currentOpacity === 0){buttonContainer.style.opacity =1};
           
        }
function disableB(){
  var edit = document.querySelector('.edit');
  var remove = document.querySelector('.remove');
  if (edit && remove){
    edit.classList.add('disableB');
    remove.classList.add('disableB');
  }
}
function enableB(){
  var edit = document.querySelector('.edit');
  var remove = document.querySelector('.remove');
  if (edit && remove){
    edit.classList.remove('disableB');
    remove.classList.remove('disableB');
  }
}
function loadData(category) {
  choisenRowData='';
  disableB();
  toggleOpacity();
  console.log('Отправляем запрос с категорией:', category);
  
  fetch(`/admin/loadData?category=${category}`)
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      
      populateTable( data)
      var h = document.querySelector('.actionSpace div h1');
      if (h) {
        h.innerHTML = category;
      }
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });
}
function populateTable(data) {
  // Получаем ссылку на таблицу по идентификатору
  const table = document.getElementById('data-table');

  // Создаем тело таблицы, если его нет
  if (!table.tBodies[0]) {
    table.createTBody();
  }

  // Получаем или создаем тело таблицы
  const tbody = table.tBodies[0];

  // Очищаем тело таблицы перед добавлением новых данных
  tbody.innerHTML = '';
  const hiddenColumns = ['id_user','id_discounted_shoes','id_shoe','id_sale','id_size','id_brand','id_order','id_review','id_bucket_row'];
  // const hiddenColumns =[''];
  // Если есть хотя бы одна запись данных
  if (data.length > 0) {
    const headersRow = tbody.insertRow();

    // Создаем заголовки таблицы на основе ключей первой записи
    Object.keys(data[0]).forEach(columnName => {
      if (!hiddenColumns.includes(columnName)) {
        const th = document.createElement('th');
        th.textContent = columnName;
        headersRow.appendChild(th);
      }
    });

    // Перебираем оставшиеся записи и создаем строки
    data.forEach(rowData => {
      const row = tbody.insertRow();
      row.addEventListener('click',function() {
        chooseRow(rowData,row); // Передаем данные строки в функцию chooseRow
      });
      // Перебираем значения записи и создаем ячейки данных
      Object.entries(rowData).forEach(([columnName, value], columnIndex) => {
        if (!hiddenColumns.includes(columnName)) {
          const cell = row.insertCell();
      
          if ((columnName === 'date' || columnName === 'start_date' || columnName === 'end_date' || columnName === 'receipt_date'|| columnName === 'order_date'|| columnName ==='review_date') && value) {
            const dateObject = new Date(value);
            cell.textContent = dateObject.toLocaleDateString();
          } else {
            cell.textContent = value;
          }
      
          cell.classList.add(columnName);
        }
      });
    });
  }
}
function chooseRow(rowData,row){
  // console.log('Выбранная строка:', rowData);
  row.classList.add('activeRow')
  if (choisenRow){
    choisenRow.classList.remove('activeRow');
  }
  choisenRow=row;
  choisenRowData=rowData;
  enableB();
  console.log('Выбранная строка:', choisenRow);

}
function putmessage(mes){
  var div = document.querySelector('.messageContainer div');
  div.innerHTML=mes
}
function remove(){
  console.log(choisenRowData,choisenCategory);
  removefunc(choisenRowData,choisenCategory);
}

function removefunc(data, category) {
  console.log(data, category);
  var id = '';
  console.log(data)
  switch (category) {
    case 'brand':
      console.log(data.id_brand)
      id = data.id_brand;
      break;
    case 'appuser':
      console.log(data.id_user)
      id = data.id_user;
      break;
    case 'discounted_shoes':
      id = data.id_discounted_shoes;
      break;
    case 'review':
      id = data.id_review;
      break;
    case 'review':
        id = data.id_review;
        break;
    case 'sale':
      id = data.id_sale;
      break;
    case 'shoe':
      id = data.id_shoe;
      break;
    case 'size':
      id = data.id_size;
      break;
    case 'user_order':
      id = data.id_order;
    case 'bucket_row':
      id = data.id_bucket_row;
      break;
    // Добавьте другие кейсы для других категорий, если необходимо
  }
  console.log(id,category )
  fetch(`/admin/removeData/${category}/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        // Если код состояния успешный (2xx), обновите таблицу или выполните другие действия
        console.log(`Запись с id ${id} успешно удалена.`);
        putmessage(`Запись с id ${id} успешно удалена.`)
        loadData(choisenC);
        // Обновите таблицу или выполните другие действия после удаления записи
      } else {
        // Если код состояния не 2xx, выведите сообщение об ошибке
        console.error(`Ошибка удаления данных. Код состояния: ${response.status}`);
        putmessage(`Ошибка удаления данных. Код состояния: ${response.status}`)
      }
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });
}
function add(){
  addfunc(choisenCategory)
}
function addfunc(category){
  console.log(category)
  switch (category){
    case 'brand':
      addBrand()
      break;
    case 'sale':
    addSale()
    break;
    case 'appuser':
      addAppuser()
      break;
    case 'discounted_shoes':
      addDiscounted_shoes();
      break;
    case 'size':
      addSize();
      break;
    case 'user_order':
      addUser_order();
      break;
    case 'shoe':
      addShoe();
      break;
      case 'bucket_row':
        addBucket_row();
        break;
    case 'review':
      addreview();
      break;
  }
}

function edit(){
  if (choisenRow){
  editfunc(choisenCategory)
  }
}
function editfunc(category){
  console.log(category)
  switch (category){
    case 'brand':
      editBrand(choisenRowData)
      break;
    case 'sale':
        editSale(choisenRowData)
        break;
    case 'appuser':
      editAppuser(choisenRowData)
      break;
    case 'user_order':
      editUser_order(choisenRowData)
      break;
    case 'shoe':
        editShoe(choisenRowData)
        break;
    case 'review':
    editReview(choisenRowData)
    break;
  }
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutButtons = document.getElementsByClassName('exit');
    // console.log(logoutButtons);
  
    // Преобразуем HTMLCollection в массив
    const buttonsArray = Array.from(logoutButtons);
  
    // Или можно использовать spread-оператор
    // const buttonsArray = [...logoutButtons];
  
    buttonsArray.forEach(function (button) {
      button.addEventListener('click', async function () {
        try {
          const response = await fetch('/admin/logout', {
            method: 'POST',
          });
  
          if (response.ok) {
            // Перенаправление пользователя после выхода из сессии
            window.location.href = '/';
          } else {
            console.error('Ошибка выхода из сессии:', response.status);
          }
        } catch (error) {
          console.error('Ошибка выхода из сессии:', error);
        }
      });
    });
  });
  

  function addBrand(){
    var window = document.getElementsByClassName('brandWindow')[0];
    var content = document.getElementsByClassName('brandWindow-content')[0];
    var submitBtn = document.getElementsByClassName('brandSubmit')[0];
    var closeBtn = document.getElementsByClassName('brandClose')[0];
    content.querySelector('h1').innerHTML = 'Запись в таблицу Бренд'
    window.style.display = 'block';
  
    closeBtn.onclick = function() {
      window.style.display = 'none';
    };
  
  
  
    const name = content.querySelector('#name');
    const description = content.querySelector('#description');
    const nameLength = 50;
    const descriptionLength = 500;
  
    name.addEventListener('input', function () {
    const remainingChars = nameLength - name.value.length;
  
    if (remainingChars < 0) {
      name.value = name.value.slice(0, nameLength); // Обрезаем ввод до максимальной длины
    }
  });
    description.addEventListener('input', function () {
    const remainingChars = descriptionLength - description.value.length;
  
    if (remainingChars < 0) {
      description.value = description.value.slice(0, descriptionLength); // Обрезаем ввод до максимальной длины
    }
    submitBtn.onclick = function () {
      const brandData = {
        name: name.value,
        description: description.value,
      };
  
      // Отправляем данные на сервер (admin js)
      fetch('/admin/addbrand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          putmessage(data.message);
          // Обновите таблицу или выполните другие действия после добавления записи
        })
        .catch(error => {
          console.error('Ошибка загрузки данных:', error);
          putmessage(`Ошибка загрузки данных: ${error.message}`);
        });
      window.style.display = 'none';
      name.value='';
      description.value='';
      loadData(choisenC)
    };
  });
  
  }
  function editBrand(data) {
    var window = document.getElementsByClassName('brandWindow')[0];
    var content = document.getElementsByClassName('brandWindow-content')[0];
    var submitBtn = document.getElementsByClassName('brandSubmit')[0];
    var closeBtn = document.getElementsByClassName('brandClose')[0];
    content.querySelector('h1').innerHTML = 'Обновление данных Бренда';
  
    const name = content.querySelector('#name');
    const description = content.querySelector('#description');
    name.value = data.name;
    description.value = data.description;
    window.style.display = 'block';
  
    closeBtn.onclick = function () {
      window.style.display = 'none';
    };
  
    const nameLength = 50;
    const descriptionLength = 500;
  
    name.addEventListener('input', function () {
      const remainingChars = nameLength - name.value.length;
  
      if (remainingChars < 0) {
        name.value = name.value.slice(0, nameLength); // Обрезаем ввод до максимальной длины
      }
    });
  
    description.addEventListener('input', function () {
      const remainingChars = descriptionLength - description.value.length;
  
      if (remainingChars < 0) {
        description.value = description.value.slice(0, descriptionLength); // Обрезаем ввод до максимальной длины
      }
    });
  
    submitBtn.onclick = function () {
      const brandData = {
        name: name.value,
        description: description.value,
      };
  
      // Отправляем данные на сервер для обновления (admin js)
      fetch(`/admin/updatebrand/${data.id_brand}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          putmessage(data.message);
          // Обновите таблицу или выполните другие действия после обновления записи
        })
        .catch(error => {
          console.error('Ошибка загрузки данных:', error);
          putmessage(`Ошибка загрузки данных: ${error.message}`);
        });
      window.style.display = 'none';
      name.value = '';
      description.value = '';
      loadData(choisenC);
    };
  }





  function addSale(){
    var window = document.getElementsByClassName('SaleWindow')[0];
    var content = document.getElementsByClassName('SaleWindow-content')[0];
    var submitBtn = document.getElementsByClassName('saleSubmit')[0];
    var closeBtn = document.getElementsByClassName('saleClose')[0];
    content.querySelector('h1').innerHTML = 'Запись в таблицу скидка'
    window.style.display = 'block';
  
    closeBtn.onclick = function() {
      window.style.display = 'none';
    };
  
  
  
    const value = content.querySelector('#value');
    const start_date = content.querySelector('#start_date');
    const end_date = content.querySelector('#end_date');
    const description = content.querySelector('#description');
    const descriptionLength = 200;
    const valueLength = 3;
    description.addEventListener('input', function () {
    const remainingChars = descriptionLength - description.value.length;
  
    if (remainingChars < 0) {
      description.value = description.value.slice(0, descriptionLength); // Обрезаем ввод до максимальной длины
    }
  });
  value.addEventListener('input', function () {
    const remainingChars = valueLength - value.value.length;
  
    if (remainingChars < 0) {
      value.value = value.value.slice(0, valueLength); // Обрезаем ввод до максимальной длины
    }
  });
    submitBtn.onclick = function () {
      const numericValue = parseFloat(value.value);
      if (isNaN(numericValue) || numericValue < 1 || numericValue > 100) {
        // Если значение не соответствует условиям, выведите сообщение об ошибке
        alert('Значение скидки должно быть числом в диапазоне от 1 до 100.');
        return;
      }
    
      const Data = {
        value: value.value,
       description: description.value,
       start_date: start_date.value,
       end_date: end_date.value,
      };
  
      // Отправляем данные на сервер (admin js)
      fetch('/admin/addsale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Data),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          putmessage(data.message);
          // Обновите таблицу или выполните другие действия после добавления записи
        })
        .catch(error => {
          console.error('Ошибка загрузки данных:', error);
          putmessage(`Ошибка загрузки данных: ${error.message}`);
        });
      window.style.display = 'none';
      value.value ='';
      description.value='';
      start_date.value='';
      end_date.value='';
      loadData(choisenC)
    };
  
  
  }

  function editSale(data){
    var window = document.getElementsByClassName('SaleWindow')[0];
    var content = document.getElementsByClassName('SaleWindow-content')[0];
    var submitBtn = document.getElementsByClassName('saleSubmit')[0];
    var closeBtn = document.getElementsByClassName('saleClose')[0];
    content.querySelector('h1').innerHTML = 'Обновление данных скидки'
    
    const value = content.querySelector('#value');
    const start_date = content.querySelector('#start_date');
    const end_date = content.querySelector('#end_date');
    const description = content.querySelector('#description');

    value.value =data.value;
    description.value=data.description;
    start_date.value=formatDate(data.start_date);
    end_date.value=formatDate(data.end_date);



    window.style.display = 'block';

    closeBtn.onclick = function() {
      window.style.display = 'none';
    };
  
  
  
    const descriptionLength = 200;
    const valueLength = 3;
    description.addEventListener('input', function () {
    const remainingChars = descriptionLength - description.value.length;
  
    if (remainingChars < 0) {
      description.value = description.value.slice(0, descriptionLength); // Обрезаем ввод до максимальной длины
    }
  });
  value.addEventListener('input', function () {
    const remainingChars = valueLength - value.value.length;
  
    if (remainingChars < 0) {
      value.value = value.value.slice(0, valueLength); // Обрезаем ввод до максимальной длины
    }
  });
    submitBtn.onclick = function () {
      const numericValue = parseFloat(value.value);
      if (isNaN(numericValue) || numericValue < 1 || numericValue > 100) {
        // Если значение не соответствует условиям, выведите сообщение об ошибке
        alert('Значение скидки должно быть числом в диапазоне от 1 до 100.');
        return;
      }
    
      const saleData = {
        value: value.value,
       description: description.value,
       start_date: start_date.value,
       end_date: end_date.value,
      };
      console.log(data.id_sale);
      // Отправляем данные на сервер (admin js)
      fetch(`/admin/updatesale/${data.id_sale}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          putmessage(data.message);
          // Обновите таблицу или выполните другие действия после добавления записи
        })
        .catch(error => {
          console.error('Ошибка загрузки данных:', error);
          putmessage(`Ошибка загрузки данных: ${error.message}`);
        });
      window.style.display = 'none';
      value.value ='';
      description.value='';
      start_date.value='';
      end_date.value='';
      loadData(choisenC)
    };
  
  
  }
  function formatDate(dateString) {
    if (!dateString) return '';
  
    const dateObject = new Date(dateString);
    
    // Добавляем один день
    dateObject.setDate(dateObject.getDate() + 1);
  
    return dateObject.toISOString().slice(0, 10); // Формат YYYY-MM-DD
  }
  function addAppuser() {
    var window = document.getElementsByClassName('UserWindow')[0];
    var content = document.getElementsByClassName('UserWindow-content')[0];
    var submitBtn = document.getElementsByClassName('userSubmit')[0];
    var closeBtn = document.getElementsByClassName('userClose')[0];
    content.querySelector('h1').innerHTML = 'Запись в таблицу пользователь';
    window.style.display = 'block';

    closeBtn.onclick = function () {
        window.style.display = 'none';
    };

    const name = content.querySelector('#name');
    const surname = content.querySelector('#surname');
    const patronymic = content.querySelector('#patronymic');
    const gender = content.querySelector('#gender');
    const phoneNumber = content.querySelector('#phone_number'); // Исправлено имя переменной
    const email = content.querySelector('#email');
    const login = content.querySelector('#login');
    const password = content.querySelector('#password');
    const userType = content.querySelector('#user_type'); // Исправлено имя переменной

    const limitLength2 = 100;
    const limitLength3 = 150;
    const limitLength4 = 20;

    name.addEventListener('input', function () {
      const remainingChars = limitLength2 - name.value.length;
    
      if (remainingChars < 0) {
        name.value = name.value.slice(0, limitLength2); // Обрезаем ввод до максимальной длины
      }
    });
    surname.addEventListener('input', function () {
      const remainingChars = limitLength2 - surname.value.length;
    
      if (remainingChars < 0) {
        surname.value = surname.value.slice(0, limitLength2); // Обрезаем ввод до максимальной длины
      }
    });
    patronymic.addEventListener('input', function () {
      const remainingChars = limitLength2 - patronymic.value.length;
    
      if (remainingChars < 0) {
        patronymic.value = patronymic.value.slice(0, limitLength2); // Обрезаем ввод до максимальной длины
      }
    });
    phoneNumber.addEventListener('input', function () {
      const remainingChars = limitLength4 - phoneNumber.value.length;
    
      if (remainingChars < 0) {
        phoneNumber.value = phoneNumber.value.slice(0, limitLength4); // Обрезаем ввод до максимальной длины
      }
    });
    email.addEventListener('input', function () {
      const remainingChars = limitLength2 - email.value.length;
    
      if (remainingChars < 0) {
        email.value = email.value.slice(0, limitLength2); // Обрезаем ввод до максимальной длины
      }
    });
    login.addEventListener('input', function () {
      const remainingChars = limitLength3 - login.value.length;
    
      if (remainingChars < 0) {
        login.value = login.value.slice(0, limitLength3); // Обрезаем ввод до максимальной длины
      }
    });
    password.addEventListener('input', function () {
      const remainingChars = limitLength3 - password.value.length;
    
      if (remainingChars < 0) {
        password.value = password.value.slice(0, limitLength3); // Обрезаем ввод до максимальной длины
      }
    });
    submitBtn.onclick = function () {
        // Вы можете добавить дополнительные проверки для других полей, аналогично числовому полю
        if(password.value ===''||login.value===''||email.value===''){
          alert("Введите почту, логин и пароль!");
          return;
        }

        const userData = {
            name: name.value,
            surname: surname.value,
            patronymic: patronymic.value,
            gender:gender.value,
            phone_number: phoneNumber.value, // Исправлено имя переменной
            email: email.value,
            login: login.value,
            password: password.value,
            user_type: userType.value, // Исправлено имя переменной
        };

        fetch('/admin/addappuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                if (!data.success){
                  alert(data.message);
           
                }else{
                  putmessage(data.message);
                }
            })
            .catch(error => {
                console.error('Ошибка загрузки данных:', error);
                putmessage(`Ошибка загрузки данных: ${error.message}`);
            })
            .finally(() => {
              window.style.display = 'none';
              name.value = '';
              surname.value = '';
              patronymic.value = '';
              phoneNumber.value = '';
              email.value = '';
              login.value = '';
              password.value = '';
              userType.value = '';
              loadData(choisenC);
            });
    };
}
function editAppuser(data) {
  var window = document.getElementsByClassName('UserWindow')[0];
  var content = document.getElementsByClassName('UserWindow-content')[0];
  var submitBtn = document.getElementsByClassName('userSubmit')[0];
  var closeBtn = document.getElementsByClassName('userClose')[0];
  content.querySelector('h1').innerHTML = 'Обновление данных пользователя';

  const name = content.querySelector('#name');
  const surname = content.querySelector('#surname');
  const patronymic = content.querySelector('#patronymic');
  const gender = content.querySelector('#gender');
  const phoneNumber = content.querySelector('#phone_number'); // Исправлено имя переменной
  const email = content.querySelector('#email');
  const login = content.querySelector('#login');
  const password = content.querySelector('#password');
  const userType = content.querySelector('#user_type'); // Исправлено имя переменной

  name.value = data.name;
  surname.value = data.surname;
  patronymic.value = data.patronymic;
  gender.value = data.gender;
  phoneNumber.value = data.phone_number; // Исправлено имя переменной
  email.value = data.email;
  login.value = data.login;
  password.value = data.password;
  userType.value = data.user_type;

  window.style.display = 'block';

  closeBtn.onclick = function () {
    window.style.display = 'none';
  };

  const limitLength2 = 100;
  const limitLength3 = 150;
  const limitLength4 = 20;

  name.addEventListener('input', function () {
    const remainingChars = limitLength2 - name.value.length;

    if (remainingChars < 0) {
      name.value = name.value.slice(0, limitLength2); // Обрезаем ввод до максимальной длины
    }
  });
  surname.addEventListener('input', function () {
    const remainingChars = limitLength2 - surname.value.length;

    if (remainingChars < 0) {
      surname.value = surname.value.slice(0, limitLength2); // Обрезаем ввод до максимальной длины
    }
  });
  patronymic.addEventListener('input', function () {
    const remainingChars = limitLength2 - patronymic.value.length;

    if (remainingChars < 0) {
      patronymic.value = patronymic.value.slice(0, limitLength2); // Обрезаем ввод до максимальной длины
    }
  });
  phoneNumber.addEventListener('input', function () {
    const remainingChars = limitLength4 - phoneNumber.value.length;

    if (remainingChars < 0) {
      phoneNumber.value = phoneNumber.value.slice(0, limitLength4); // Обрезаем ввод до максимальной длины
    }
  });
  email.addEventListener('input', function () {
    const remainingChars = limitLength2 - email.value.length;

    if (remainingChars < 0) {
      email.value = email.value.slice(0, limitLength2); // Обрезаем ввод до максимальной длины
    }
  });
  login.addEventListener('input', function () {
    const remainingChars = limitLength3 - login.value.length;

    if (remainingChars < 0) {
      login.value = login.value.slice(0, limitLength3); // Обрезаем ввод до максимальной длины
    }
  });
  password.addEventListener('input', function () {
    const remainingChars = limitLength3 - password.value.length;

    if (remainingChars < 0) {
      password.value = password.value.slice(0, limitLength3); // Обрезаем ввод до максимальной длины
    }
  });
  submitBtn.onclick = function () {
    // Вы можете добавить дополнительные проверки для других полей, аналогично числовому полю
    if (password.value === '' || login.value === '' || email.value === '') {
      alert('Введите почту, логин и пароль!');
      return;
    }

    const userData = {
      name: name.value,
      surname: surname.value,
      patronymic: patronymic.value,
      gender: gender.value,
      phone_number: phoneNumber.value, // Исправлено имя переменной
      email: email.value,
      login: login.value,
      password: password.value,
      user_type: userType.value, // Исправлено имя переменной
    };

    fetch(`/admin/updateappuser/${data.id_user}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        if (!data.success) {
          alert(data.message);
        } else {
          putmessage(data.message);
        }
      })
      .catch(error => {
        console.error('Ошибка загрузки данных:', error);
        putmessage(`Ошибка загрузки данных: ${error.message}`);
      })
      .finally(() => {
        window.style.display = 'none';
        name.value = '';
        surname.value = '';
        patronymic.value = '';
        phoneNumber.value = '';
        email.value = '';
        login.value = '';
        password.value = '';
        userType.value = '';
        loadData(choisenC);
      });
  };
}
function addDiscounted_shoes(){
  console.log('dgdg')
  var window = document.getElementsByClassName('Discounted_shoesWindow')[0];
  var content = document.getElementsByClassName('Discounted_shoesWindow-content')[0];
  var submitBtn = document.getElementsByClassName('Discounted_shoesSubmit')[0];
  var closeBtn = document.getElementsByClassName('Discounted_shoesClose')[0];
  content.querySelector('h1').innerHTML = 'Добавление обуви скидки';
  var shoes ='';
  var sales ='';

  var saleSelector = content.querySelector('#sale_description');
  var shoeSelector = content.querySelector('#shoe_name');
  saleSelector.innerHTML = '';
  shoeSelector.innerHTML = '';
  closeBtn.onclick = function () {
    window.style.display = 'none';
  };

  fetch('/admin/getShoesNames') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      shoes=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию

    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });
  fetch('/admin/getSalesNames') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      sales=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию
      console.log(sales, shoes);
      console.log(shoes[0]);
      shoes.forEach(shoe => {
        var option = document.createElement('option');
        option.value = shoe.model_name; // Предполагаем, что у объекта shoe есть свойство id
        option.textContent = shoe.model_name; // Предполагаем, что у объекта shoe есть свойство name
        shoeSelector.appendChild(option);
      });
  
      sales.forEach(sale => {
        var option = document.createElement('option');
        option.value = sale.description; // Предполагаем, что у объекта sale есть свойство id
        option.textContent = sale.description; // Предполагаем, что у объекта sale есть свойство name
        saleSelector.appendChild(option);
        window.style.display = 'block';
      });
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });

    submitBtn.onclick = function () {
      const Discounted_shoesData = {
        shoe:shoeSelector.value,
        sale:saleSelector.value,
      };
  
      fetch('/admin/addDiscounted_shoesData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Discounted_shoesData),
    })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          if (!data.success) {
            alert(data.message);
          } else {
            putmessage(data.message);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки данных:', error);
          putmessage(`Ошибка загрузки данных: ${error.message}`);
        })
        .finally(() => {
          window.style.display = 'none';


          
          
          loadData(choisenC);
        });
    }

}
function addSize(){
  // console.log('dgdg')
  var window = document.getElementsByClassName('SizeWindow')[0];
  var content = document.getElementsByClassName('SizeWindow-content')[0];
  var submitBtn = document.getElementsByClassName('SizeSubmit')[0];
  var closeBtn = document.getElementsByClassName('SizeClose')[0];
  content.querySelector('h1').innerHTML = 'Добавление размера';
  var shoes ='';
  const value = content.querySelector('#size_value');


  var shoeSelector = content.querySelector('#shoe_name');
  shoeSelector.innerHTML = '';
  closeBtn.onclick = function () {
    window.style.display = 'none';
  };

  fetch('/admin/getShoesDefaultNames') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      shoes=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию
      console.log(shoes[0]);
      shoes.forEach(shoe => {
        var option = document.createElement('option');
        option.value = shoe.model_name; // Предполагаем, что у объекта shoe есть свойство id
        option.textContent = shoe.model_name; // Предполагаем, что у объекта shoe есть свойство name
        shoeSelector.appendChild(option);
        window.style.display = 'block';
    })

    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });

    submitBtn.onclick = function () {
      const sizeData = {
        shoe:shoeSelector.value,
        size:value.value,
      };
  
      fetch('/admin/addsize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sizeData),
    })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          if (!data.success) {
            alert(data.message);
          } else {
            putmessage(data.message);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки данных:', error);
          putmessage(`Ошибка загрузки данных: ${error.message}`);
        })
        .finally(() => {
          window.style.display = 'none';


          
          
          loadData(choisenC);
        });
    }

}

function addUser_order(){
  var window = document.getElementsByClassName('User_OrderWindow')[0];
  var content = document.getElementsByClassName('User_OrderWindow-content')[0];
  var submitBtn = document.getElementsByClassName('User_OrderSubmit')[0];
  var closeBtn = document.getElementsByClassName('User_OrderClose')[0];
  content.querySelector('h1').innerHTML = 'Добавление заказа';
  var users ='';
  const delivery_method = content.querySelector('#delivery_method');
  const adress = content.querySelector('#adress')
  var UserSelector = content.querySelector('#user_login');
  UserSelector.innerHTML = '';
  // window.style.display = 'block';

  const currentDate = new Date();
  const dateInput = content.querySelector('#date');
  const timeInput = content.querySelector('#time');

  // Форматируем дату в формат YYYY-MM-DD
  const formattedDate = currentDate.toISOString().slice(0, 10);

  // Форматируем время в формат HH:MM
  const formattedTime = currentDate.toTimeString().slice(0, 5);

  // Устанавливаем значения в соответствующие поля ввода
  dateInput.value = formattedDate;
  timeInput.value = formattedTime;
  // window.style.display = 'block';
  closeBtn.onclick = function () {
    window.style.display = 'none';
  };
  fetch('/admin/getUsersLogin') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      users=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию
      console.log(users[0]);
      users.forEach(user => {
        var option = document.createElement('option');
        option.value = user.login; // Предполагаем, что у объекта shoe есть свойство id
        option.textContent = user.login; // Предполагаем, что у объекта shoe есть свойство name
        UserSelector.appendChild(option);
        
    })
    window.style.display = 'block';
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });

    submitBtn.onclick = function () {
      const sizeData = {
        user_login:UserSelector.value,
        data:dateInput.value,
        time:timeInput.value,
        delivery_method:delivery_method.value,
        adress:adress.value,
      };
  
      fetch('/admin/addUser_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sizeData),
    })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          if (!data.success) {
            alert(data.message);
          } else {
            putmessage(data.message);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки данных:', error);
          putmessage(`Ошибка загрузки данных: ${error.message}`);
        })
        .finally(() => {
          window.style.display = 'none';

          adress.value='';
          
          
          loadData(choisenC);
        });
    }
}

function editUser_order(Data){
  var window = document.getElementsByClassName('User_OrderWindow')[0];
  var content = document.getElementsByClassName('User_OrderWindow-content')[0];
  var submitBtn = document.getElementsByClassName('User_OrderSubmit')[0];
  var closeBtn = document.getElementsByClassName('User_OrderClose')[0];
  content.querySelector('h1').innerHTML = 'Добавление заказа';
  var users ='';
  const delivery_method = content.querySelector('#delivery_method');
  const adress = content.querySelector('#adress')
  var UserSelector = content.querySelector('#user_login');
  UserSelector.innerHTML = '';
  console.log(Data)
  
  // window.style.display = 'block';

  const dateInput = content.querySelector('#date');
  const timeInput = content.querySelector('#time');


  const orderDate = new Date(Data.order_date);
const orderTime = Data.order_time;

// Форматируем дату для поля ввода с типом "date"
const formattedDate = orderDate.toISOString().split('T')[0];

dateInput.value = formattedDate;
timeInput.value = orderTime;

  delivery_method.value = Data.delivery_method
  adress.value = Data.delivery_address
  // window.style.display = 'block';
  closeBtn.onclick = function () {
    window.style.display = 'none';
  };
  fetch('/admin/getUsersLogin') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      users=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию
      console.log(users[0]);
      users.forEach(user => {
        var option = document.createElement('option');
        option.value = user.login; // Предполагаем, что у объекта shoe есть свойство id
        option.textContent = user.login; // Предполагаем, что у объекта shoe есть свойство name
        UserSelector.appendChild(option);
        
    })
    UserSelector.value = Data.login
    window.style.display = 'block';
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });
    submitBtn.onclick = function () {
      const sizeData = {
        user_login:UserSelector.value,
        data:dateInput.value,
        time:timeInput.value,
        delivery_method:delivery_method.value,
        adress:adress.value,
      };
  
      fetch(`/admin/updUser_order/${Data.id_order}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sizeData),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            if (!data.success) {
                alert(data.message);
            } else {
                putmessage(data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            putmessage(`Ошибка загрузки данных: ${error.message}`);
        })
        .finally(() => {
            window.style.display = 'none';

            adress.value = '';

            loadData(choisenC);
        });
    }
}

function addShoe(){
  var window = document.getElementsByClassName('ShoeWindow')[0];
  var content = document.getElementsByClassName('ShoeWindow-content')[0];
  var submitBtn = document.getElementsByClassName('ShoeSubmit')[0];
  var closeBtn = document.getElementsByClassName('ShoeClose')[0];
  content.querySelector('h1').innerHTML = 'Добавление обуви';
  var brands ='';

  var brandSelector = content.querySelector('#brand');
  var name = content.querySelector('#name');
  var model_type = content.querySelector('#model_type');
  var date = content.querySelector('#date');
  var description = content.querySelector('#description');
  var cost = content.querySelector('#cost');
  var gender= content.querySelector('#gender');
  var childrens = content.querySelector('#childrens');
  var color = content.querySelector('#color');

  brandSelector.innerHTML = '';  

  const currentDate = new Date();
  const dateInput = content.querySelector('#date');
  const formattedDate = currentDate.toISOString().slice(0, 10);

  dateInput.value = formattedDate;


  closeBtn.onclick = function () {
    window.style.display = 'none';
  };

  const sizesArray = Array.from({ length: 35 }, (_, index) => index + 16);
  const sizesContainer = document.getElementById('sizesContainer');
  sizesContainer.innerHTML=''
  const selectedSizes = new Set();

  sizesArray.forEach(size => {
    const sizeSquare = document.createElement('div');
    sizeSquare.classList.add('sizeSquare');
    sizeSquare.textContent = size;
    sizeSquare.setAttribute('data-size', size);
  
    sizeSquare.addEventListener('click', function() {
      handleSizeSelection(size, sizeSquare);
    });
  
    sizesContainer.appendChild(sizeSquare);
  });
  
  function handleSizeSelection(size, sizeSquare) {
    if (selectedSizes.has(size)) {
      // Если размер уже выбран, снимаем выделение
      selectedSizes.delete(size);
      sizeSquare.classList.remove('selected');
    } else {
      // Если размер не выбран, выделяем его
      selectedSizes.add(size);
      sizeSquare.classList.add('selected');
    }
  
    // Добавьте вашу логику обработки выбранных размеров, например, внесение в базу данных
    console.log('Выбранные размеры:', Array.from(selectedSizes));
  }
  fetch('/admin/getBrands') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      brands=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию
      console.log(brands[0]);
      brands.forEach(brand => {
        var option = document.createElement('option');
        option.value = brand.name; // Предполагаем, что у объекта shoe есть свойство id
        option.textContent = brand.name; // Предполагаем, что у объекта shoe есть свойство name
        brandSelector.appendChild(option);
        
    })
    window.style.display = 'block';
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });

    submitBtn.onclick = function () {
      if (name.value === '' || cost.value === '' || color.value === '') {
        alert('Название модели, цену и цвет!');
        return;
      }
      const shoeData = {
        name:name.value, 
        model_type :model_type.value, 
        brand :brandSelector.value, 
        date :date.value, 
        description:description.value, 
        cost:cost.value, 
        gender:gender.value, 
        childrens :childrens.value, 
        color:color.value, 
      };
      
          fetch(`/admin/addShoe`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(shoeData),
      })
          .then(response => response.json())
          .then(data => {
              console.log(data.message);
              if (!data.success) {
                  alert(data.message);
                  return;
              }else{
                putmessage(data.message);
              }
          })
          .catch(error => {
              console.error('Ошибка загрузки данных:', error);
              putmessage(`Ошибка загрузки данных: ${error.message}`);
          })

          const selectedSizesArray = Array.from(selectedSizes);
        if (!selectedSizesArray.length==0){
          const sizeData = {
            name:name.value,
            selectedSizesArray,
          };
        console.log(23424)
        fetch(`/admin/addSizes`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(sizeData),
      })
          .then(response => response.json())
          .then(data => {
              console.log(data.message);
              if (!data.success) {
                  alert(data.message);
              } else {
                  putmessage(data.message);
              }
          })
          .catch(error => {
              console.error('Ошибка загрузки данных:', error);
              putmessage(`Ошибка загрузки данных: ${error.message}`);
          })
          .finally(() => {
            window.style.display = 'none';
            color.value='';
            name.value=''
            description.value=''
            cost.value=''
            loadData(choisenC);
        });
      }else{
        window.style.display = 'none';

        color.value='';
        name.value=''
        description.value=''
        cost.value=''

        loadData(choisenC);
      }
 
        
        
    }
}

function editShoe(Data){
  console.log(Data)
  var window = document.getElementsByClassName('ShoeWindow')[0];
  var content = document.getElementsByClassName('ShoeWindow-content')[0];
  var submitBtn = document.getElementsByClassName('ShoeSubmit')[0];
  var closeBtn = document.getElementsByClassName('ShoeClose')[0];
  content.querySelector('h1').innerHTML = 'Добавление обуви';
  var brands ='';

  var brandSelector = content.querySelector('#brand');
  var name = content.querySelector('#name');
  var model_type = content.querySelector('#model_type');
  var date = content.querySelector('#date');
  var description = content.querySelector('#description');
  var cost = content.querySelector('#cost');
  var gender= content.querySelector('#gender');
  var childrens = content.querySelector('#childrens');
  var color = content.querySelector('#color');

  brandSelector.innerHTML = '';

  // window.style.display = 'block';
  closeBtn.onclick = function () {
    window.style.display = 'none';
  };

  color.value = Data.color;
  name.value = Data.model_name;

  const orderDate = new Date(Data.receipt_date);

  const formattedDate = orderDate.toISOString().split('T')[0];
  date.value = formattedDate;

  description.value = Data.description;
  cost.value = Data.cost;
  gender.value = Data.gender;
  model_type.value = Data.model_type;
  childrens.value=Data.childrens;
  var selectedSizes = new Set();
  fetch('/admin/getBrands') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      brands=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию
      console.log(brands[0]);
      brands.forEach(brand => {
        var option = document.createElement('option');
        option.value = brand.name; // Предполагаем, что у объекта shoe есть свойство id
        option.textContent = brand.name; // Предполагаем, что у объекта shoe есть свойство name
        brandSelector.appendChild(option);
        
    })
    brandSelector.value = Data.brand_name
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });
    fetch(`/admin/getSizes/${Data.id_shoe}`) // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      
      const valuesArray = data.map(size => size.value);

      const sizesArray = Array.from({ length: 35 }, (_, index) => index + 16);
      const sizesContainer = document.getElementById('sizesContainer');
      sizesContainer.innerHTML=''
      
    
      sizesArray.forEach(size => {
        const sizeSquare = document.createElement('div');
        sizeSquare.classList.add('sizeSquare');
        sizeSquare.textContent = size;
        sizeSquare.setAttribute('data-size', size);

        if (valuesArray.includes(size)) {
          sizeSquare.classList.add('selected');
          selectedSizes.add(size);
        }
        sizeSquare.addEventListener('click', function() {
          handleSizeSelection(size, sizeSquare);
        });
      
        sizesContainer.appendChild(sizeSquare);
      });
      console.log('Выбранные размеры:', Array.from(selectedSizes));
      function handleSizeSelection(size, sizeSquare) {
        if (selectedSizes.has(size)) {
          // Если размер уже выбран, снимаем выделение
          selectedSizes.delete(size);
          sizeSquare.classList.remove('selected');
        } else {
          // Если размер не выбран, выделяем его
          selectedSizes.add(size);
          sizeSquare.classList.add('selected');
        }
      
        // Добавьте вашу логику обработки выбранных размеров, например, внесение в базу данных
        console.log('Выбранные размеры:', Array.from(selectedSizes));
      }
    window.style.display = 'block';
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });
    submitBtn.onclick = function () {
      if (name.value === '' || cost.value === '' || color.value === '') {
        alert('Название модели, цену и цвет!');
        return;
      }
      const shoeData = {
        name:name.value, 
        model_type :model_type.value, 
        brand :brandSelector.value, 
        date :date.value, 
        description:description.value, 
        cost:cost.value, 
        gender:gender.value, 
        childrens :childrens.value, 
        color:color.value, 
      };
      
          fetch(`/admin/UpdateShoe/${Data.id_shoe}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(shoeData),
      })
          .then(response => response.json())
          .then(data => {
              console.log(data.message);
              if (!data.success) {
                  alert(data.message);
                  return;
              }else{
                putmessage(data.message);
              }
          })
          .catch(error => {
              console.error('Ошибка загрузки данных:', error);
              putmessage(`Ошибка загрузки данных: ${error.message}`);
          })
          console.log(selectedSizes)
          const selectedSizesArray = Array.from(selectedSizes);
        
          const sizeData = {
            name:name.value,
            selectedSizesArray,
          };
        console.log(23424)
        fetch(`/admin/UpdateSizes/${Data.id_shoe}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(sizeData),
      })
          .then(response => response.json())
          .then(data => {
              console.log(data.message);
              if (!data.success) {
                  alert(data.message);
              } else {
                  putmessage(data.message);
              }
          })
          .catch(error => {
              console.error('Ошибка загрузки данных:', error);
              putmessage(`Ошибка загрузки данных: ${error.message}`);
          })
          .finally(() => {
            window.style.display = 'none';
            color.value='';
            name.value=''
            description.value=''
            cost.value=''
            loadData(choisenC);
        });


    }  

}

function  addBucket_row(){

  var window = document.getElementsByClassName('bucket_rowWindow')[0];
  var content = document.getElementsByClassName('bucket_rowWindow-content')[0];
  var submitBtn = document.getElementsByClassName('bucket_rowSubmit')[0];
  var closeBtn = document.getElementsByClassName('bucket_rowClose')[0];
  content.querySelector('h1').innerHTML = 'Добавление строки корзины';
  window.style.display = 'block';
  closeBtn.onclick = function () {
    window.style.display = 'none';
  };
}




function addreview(){
  var window = document.getElementsByClassName('reviewWindow')[0];
  var content = document.getElementsByClassName('reviewWindow-content')[0];
  var submitBtn = document.getElementsByClassName('reviewSubmit')[0];
  var closeBtn = document.getElementsByClassName('reviewClose')[0];
  content.querySelector('h1').innerHTML = 'Добавление отзыва';
  
  closeBtn.onclick = function () {
    window.style.display = 'none';
  };

  const currentDate = new Date();
  const dateInput = content.querySelector('#date');
  const timeInput = content.querySelector('#time');

  // Форматируем дату в формат YYYY-MM-DD
  const formattedDate = currentDate.toISOString().slice(0, 10);

  // Форматируем время в формат HH:MM
  const formattedTime = currentDate.toTimeString().slice(0, 5);

  // Устанавливаем значения в соответствующие поля ввода
  dateInput.value = formattedDate;
  timeInput.value = formattedTime;

  var model_nameSelector = content.querySelector('#model_name');
  var user_loginSelector = content.querySelector('#user_login');
  var text = content.querySelector('#text');
  var rating = content.querySelector('#rating');


  fetch('/admin/getUsersLogin') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      users=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию
      console.log(users[0]);
      users.forEach(user => {
        var option = document.createElement('option');
        option.value = user.login; // Предполагаем, что у объекта shoe есть свойство id
        option.textContent = user.login; // Предполагаем, что у объекта shoe есть свойство name
        user_loginSelector.appendChild(option);
        
    })
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });
    fetch('/admin/getShoesDefaultNames') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      shoes=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию
      console.log(shoes[0]);
      shoes.forEach(shoe => {
        var option = document.createElement('option');
        option.value = shoe.model_name; // Предполагаем, что у объекта shoe есть свойство id
        option.textContent = shoe.model_name; // Предполагаем, что у объекта shoe есть свойство name
        model_nameSelector.appendChild(option);
        window.style.display = 'block';
    })

    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });

    submitBtn.onclick = function () {
      const reviewData = {
        model_name:model_nameSelector.value,
        user:user_loginSelector.value,
        text:text.value,
        rating:rating.value,
        date:dateInput.value,
        time:timeInput.value,
      };
      
          fetch(`/admin/addReview`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
      })
          .then(response => response.json())
          .then(data => {
              console.log(data.message);
              if (!data.success) {
                  alert(data.message);
                  return;
              }else{
                putmessage(data.message);
              }
          })
          .catch(error => {
              console.error('Ошибка загрузки данных:', error);
              putmessage(`Ошибка загрузки данных: ${error.message}`);
          })

          .finally(() => {
            window.style.display = 'none';
            text.value='';

            loadData(choisenC);
        });
     
      
        
    }
 
}

function editReview(Data){
  console.log(Data)
  var window = document.getElementsByClassName('reviewWindow')[0];
  var content = document.getElementsByClassName('reviewWindow-content')[0];
  var submitBtn = document.getElementsByClassName('reviewSubmit')[0];
  var closeBtn = document.getElementsByClassName('reviewClose')[0];
  content.querySelector('h1').innerHTML = 'Изменение отзыва';

  var model_nameSelector = content.querySelector('#model_name');
  var user_loginSelector = content.querySelector('#user_login');
  var text = content.querySelector('#text');
  var rating = content.querySelector('#rating');
  const dateInput = content.querySelector('#date');
  const timeInput = content.querySelector('#time');

  text.value= Data.text
  rating.value=Data.rating

  const orderDate = new Date(Data.review_date);
const orderTime = Data.review_time;

// Форматируем дату для поля ввода с типом "date"
const formattedDate = orderDate.toISOString().split('T')[0];

dateInput.value = formattedDate;
timeInput.value = orderTime;


  closeBtn.onclick = function () {
    window.style.display = 'none';
  };


  fetch('/admin/getUsersLogin') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      users=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию
      console.log(users[0]);
      users.forEach(user => {
        var option = document.createElement('option');
        option.value = user.login; // Предполагаем, что у объекта shoe есть свойство id
        option.textContent = user.login; // Предполагаем, что у объекта shoe есть свойство name
        user_loginSelector.appendChild(option);
        
    })
    user_loginSelector.value = Data.user_login
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });
    fetch('/admin/getShoesDefaultNames') // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      shoes=data;
      // Вставка полученных данных в ваш интерфейс, например, через функцию
      console.log(shoes[0]);
      shoes.forEach(shoe => {
        var option = document.createElement('option');
        option.value = shoe.model_name; // Предполагаем, что у объекта shoe есть свойство id
        option.textContent = shoe.model_name; // Предполагаем, что у объекта shoe есть свойство name
        model_nameSelector.appendChild(option);
    })
    model_nameSelector.value = Data.model_name;
    window.style.display = 'block';
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });
    submitBtn.onclick = function () {
      const reviewData = {
        model_name:model_nameSelector.value,
        user:user_loginSelector.value,
        text:text.value,
        rating:rating.value,
        date:dateInput.value,
        time:timeInput.value,
      };
      
          fetch(`/admin/UpdateReview/${Data.id_review}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
      })
          .then(response => response.json())
          .then(data => {
              console.log(data.message);
              if (!data.success) {
                  alert(data.message);
                  return;
              }else{
                putmessage(data.message);
              }
          })
          .catch(error => {
              console.error('Ошибка загрузки данных:', error);
              putmessage(`Ошибка загрузки данных: ${error.message}`);
          })

          .finally(() => {
            window.style.display = 'none';
            text.value='';
            loadData(choisenC);
        });
     
      
        
    }
}   
