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
          const response = await fetch('/catalog/logout', {
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

  var choisenRowData=''
  var choisenRow=''
  var choisenCategory=''
  var choisenC=''
  var buttons = document.querySelector('.buttonContainer')
  buttons.style.display = 'none';
  document.getElementById('shoe').addEventListener('click', function(event) {
    buttons.style.display = 'none';
    choisenC='Список обуви'
    loadData(choisenC);
    choiseItem(event.target)
  });
  document.getElementById('discounted_shoes').addEventListener('click', function(event) {
    buttons.style.display = 'none';
   choisenC='Обувь со скидкой'
    loadData(choisenC);
    choiseItem(event.target)
  });
  document.getElementById('bestsellers_shoes').addEventListener('click', function(event) {
    buttons.style.display = 'none';
   choisenC='Бестселлеры'
   bestsellers()
    // loadData(choisenC);
    choiseItem(event.target)
  });
  document.getElementById('new_shoes').addEventListener('click', function(event) {
    buttons.style.display = 'none';
    newShoe();
   choisenC='Новая обувь'
    // loadData(choisenC);
    choiseItem(event.target)
  });
  document.getElementById('highrated_shoes').addEventListener('click', function(event) {
    buttons.style.display = 'none';
   choisenC='Высокооценённая обувь'
    loadData(choisenC);
    choiseItem(event.target)
  });
  document.getElementById('brand').addEventListener('click', function(event) {
    buttons.style.display = 'none';
    choisenC='Бренды'
    loadData(choisenC);
    choiseItem(event.target)
  });


  document.getElementById('user_order').addEventListener('click', function(event) {
    buttons.style.display = 'none';
    choisenC='Мои заказы'
    loadData(choisenC);
    choiseItem(event.target)
  });
  document.getElementById('bucket_row').addEventListener('click', function(event) {
    buttons.style.display = 'flex';
    toggleOpacity()
    choisenC='Корзина'
    loadData(choisenC);
    choiseItem(event.target)
  });
  function toggleOpacity() {
    var buttonContainer = document.querySelector('.buttonContainer');
              var currentOpacity = parseFloat(window.getComputedStyle(buttonContainer).opacity);
              console.log(currentOpacity)
              // Изменяем значение opacity
              if (currentOpacity === 0){buttonContainer.style.opacity =1};
             
          }
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
  function putmessage(mes){
    var div = document.querySelector('.messageContainer div');
    div.innerHTML=mes
  }
  function loadData(category) {
    choisenRowData='';
    console.log('Отправляем запрос с категорией:', category);
    
    fetch(`/catalog/loadData?category=${category}`)
      .then(response => response.json())
      .then(data => {
        // Обработка полученных данных
        console.log(data);
        
        populateTable( data,choisenCategory)
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
  function populateTable(data, currentTableName) {
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
    const hiddenColumns = ['id_order','user_login','ordered','id_user','id_discounted_shoes','id_shoe','id_sale','id_size','id_brand','id_review','id_bucket_row'];
    // const hiddenColumns =[''];
  
    // Если есть хотя бы одна запись данных
    if (data.length > 0) {
      const headersRow = tbody.insertRow();
  
      // Создаем объект с соответствиями для каждой таблицы
      const columnTranslations = {
        brand: {
          name: 'Название брнеда',
          description: 'Описание',
          // Добавьте другие колонки по аналогии
        },
        shoe: {
          model_name: 'Название модели',
          model_type: 'Тип обуви',
          receipt_date: 'Дата поставки',
          description: 'Описание',
          cost: 'Цена',
          rating: 'Оценка',
          gender: 'Пол',
          childrens: 'Детская',
          gender: 'Пол',
          color: 'Цвет',
          brand_name: 'Бренд',
          discounted_cost: 'Цена со скидкой',
          // Названия колонок для второй таблицы
        },
        discounted_shoes: {
          model_name: 'Название модели',
          model_type: 'Тип обуви',
          receipt_date: 'Дата поставки',
          description: 'Описание',
          cost: 'Цена',
          rating: 'Оценка',
          gender: 'Пол',
          childrens: 'Детская',
          gender: 'Пол',
          color: 'Цвет',
          brand_name: 'Бренд',
          discounted_cost: 'Цена со скидкой',
          // Названия колонок для второй таблицы
        },
        user_order: {
          order_id: 'Код заказа',
          status:'Статус',
          cost:'Цена',
          order_date: 'Дата заказа',
          order_time: 'Время заказа',
          delivery_method: 'Метод доставки',
          delivery_address: 'Адрес',
          total_cost: 'Стоимость',
          payment_status: 'Статус',
  
          // Названия колонок для второй таблицы
        },
        review: {
          user_login: 'Логин',
          user_name: 'Имя',
          model_name: 'Название модели',
          text: 'Текст',
          rating: 'Рейтинг',
          review_date: 'Дата',
          review_time: 'Время',
  
          // Названия колонок для второй таблицы
        },

        bucket_row: {
          id_order: 'Код строки ',
          amount_of_shoes: 'Количество пар',
          size: 'Размер',
          ordered: 'Заказана',
          model_name: 'Название модели',
          cost: 'Цена',
          discounted_cost: 'Цена со скидкой',
          user_login: 'Логин',
          // Названия колонок для второй таблицы
        },
        bestsellers_shoes:{
          model_name: 'Название модели',
          model_type: 'Тип обуви',
          receipt_date: 'Дата поставки',
          description: 'Описание',
          cost: 'Цена',
          rating: 'Оценка',
          gender: 'Пол',
          childrens: 'Детская',
          gender: 'Пол',
          color: 'Цвет',
          brand_name: 'Бренд',
          discounted_cost: 'Цена со скидкой',
          order_count: 'Кол. заказов',
          // Названия колонок для второй таблицы
        },
        new_shoes:
        {
          model_name: 'Название модели',
          model_type: 'Тип обуви',
          receipt_date: 'Дата поставки',
          description: 'Описание',
          cost: 'Цена',
          rating: 'Оценка',
          gender: 'Пол',
          childrens: 'Детская',
          gender: 'Пол',
          color: 'Цвет',
          brand_name: 'Бренд',
          discounted_cost: 'Цена со скидкой',
          user_login: 'Логин',
          // Названия колонок для второй таблицы
        },
        highrated_shoes:
        {
          model_name: 'Название модели',
          model_type: 'Тип обуви',
          receipt_date: 'Дата поставки',
          description: 'Описание',
          cost: 'Цена',
          rating: 'Оценка',
          gender: 'Пол',
          childrens: 'Детская',
          gender: 'Пол',
          color: 'Цвет',
          brand_name: 'Бренд',
          discounted_cost: 'Цена со скидкой',
          user_login: 'Логин',
          // Названия колонок для второй таблицы
        },
        // Добавьте другие таблицы по аналогии
      };
  
      // Создаем заголовки таблицы на основе ключей первой записи
      Object.keys(data[0]).forEach(columnName => {
        if (!hiddenColumns.includes(columnName)) {
          const th = document.createElement('th');
          // Проверяем, есть ли перевод для текущей таблицы и колонки
          const translation = columnTranslations[currentTableName] && columnTranslations[currentTableName][columnName];
          th.textContent = translation || columnName;
          headersRow.appendChild(th);
        }
      });
  
      // Перебираем оставшиеся записи и создаем строки
      if (choisenC === 'Корзина') {
        const checkboxHeader = document.createElement('th');
        checkboxHeader.textContent = 'Выбрано';
        headersRow.insertBefore(checkboxHeader, headersRow.firstChild); // Вставляем в начало строки
      }
      
      // Перебираем оставшиеся записи и создаем строки
      data.forEach(rowData => {
        const row = tbody.insertRow();
        switch (choisenC) {
          case 'Список обуви':
            row.addEventListener('click', function() {
              chooseShoe(rowData, row);
            });
            break;
        case 'Обувь со скидкой':
          row.addEventListener('click', function() {
            chooseShoe(rowData, row);
            
          });
          case 'Высокооценённая обувь':
          row.addEventListener('click', function() {
            chooseShoe(rowData, row);
            
          });
          break;
          case 'Бестселлеры':
            row.addEventListener('click', function() {
              chooseShoe(rowData, row);
            });
            break;
            case 'Новая обувь':
              row.addEventListener('click', function() {
                chooseShoe(rowData, row);
              });
              break;
            case 'Мои заказы':
              row.addEventListener('click', function() {
                chooseOrder(rowData, row);
              });
            break;
        }

        // Добавляем чекбокс только для строк, если choisenC равно "Корзина"
        if (choisenC === 'Корзина') {
          const checkboxCell = row.insertCell();
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
      
          // Добавляем обработчик события для чекбокса
          checkbox.addEventListener('change', function() {
            
            handleCheckboxChange(rowData, checkbox);
          });
      
          checkboxCell.appendChild(checkbox);
        }
      
        // Добавляем обработчик события для строки
        row.addEventListener('click', function() {
          chooseRow(rowData, row);
        });
  
        // Перебираем значения записи и создаем ячейки данных
        Object.entries(rowData).forEach(([columnName, value], columnIndex) => {
          if (!hiddenColumns.includes(columnName)) {
            const cell = row.insertCell();
      
            if ((columnName === 'date' || columnName === 'start_date' || columnName === 'end_date' || columnName === 'receipt_date' || columnName === 'order_date' || columnName === 'review_date') && value) {
              const dateObject = new Date(value);
              cell.textContent = dateObject.toLocaleDateString();
            } else {
              // console.log(value)
              switch(value){
                case true:
                  cell.textContent = "Да";
                  break;
                case false:
                  cell.textContent = "Нет";
                  break;
                default:
                  cell.textContent = value;
                  break;
              } 
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
    console.log('Выбранная строка:', choisenRow);
  
  }
  var selectedRows = [];

  function handleCheckboxChange(rowData, checkbox) {
    // Если чекбокс выбран, добавляем всю строку в массив
    if (checkbox.checked) {
      selectedRows.push(rowData);
    } else {
      // Если чекбокс не выбран, убираем строку из массива
      selectedRows = selectedRows.filter(selectedRow => selectedRow !== rowData);
    }
  
    // Пример использования: выводим выбранные строки в консоль
    console.log('Выбранные строки:', selectedRows);
  }
  function chooseShoe(Data, row){
    console.log(Data)
    var window = document.getElementsByClassName('shoeWindow')[0];
    var content = document.getElementsByClassName('shoeWindow-content')[0];
    var submitBtn = document.getElementsByClassName('add')[0];
    var closeBtn = document.getElementsByClassName('back')[0];
    var OpenAddReviewBtn = document.getElementsByClassName('OpenAddReview')[0];
    var AddReviewBtn = document.getElementsByClassName('AddReview')[0];
    var contentReview = document.getElementById('addReviewContainer');
    var table = document.getElementById("ReviewsTable");

    var name = content.querySelector('#name');
    var type = content.querySelector('#type');
    var brand = content.querySelector('#brand');
    var date = content.querySelector('#date');
    var description = content.querySelector('#description');
    var cost = content.querySelector('#cost');
    var Salecost = content.querySelector('#Salecost');
    var rating = content.querySelector('#rating');
    var gender = content.querySelector('#gender');
    var childrens = content.querySelector('#childrens');
    var color = content.querySelector('#color');

    var Rtext = content.querySelector('#Reviewtext');
    var Rrating = content.querySelector('#Reviewrating');

    var amount = content.querySelector('#amount');
    var selectedSize = null

    name.value=Data.model_name;
    type.value=Data.model_type;
    brand.value=Data.brand_name;
    
    const orderDate = new Date(Data.receipt_date);
    const formattedDate = orderDate.toISOString().split('T')[0];
    date.value = formattedDate;

    description.value=Data.description;
    cost.value=Data.cost;
    Salecost.value=Data.discounted_cost;
    rating.value=Data.rating;
    gender.value=Data.gender;
    childrens.value=Data.childrens;
    color.value=Data.color;

    closeBtn.onclick = function () {
        window.style.display = 'none';
        table.innerHTML=''
      };
      function addRow(table, rowData) {
        var row = table.insertRow();
        var values = Object.values(rowData);
    
        values.forEach(function (value) {
            var cell = row.insertCell();
    
            // Проверка, является ли значение датой
            if (isDate(value)) {
                var dateObject = new Date(value);
                cell.textContent = dateObject.toLocaleDateString();
            } else {
                cell.innerHTML = value;
            }
        });
    }
    function isDate(value) {
      return (new Date(value) !== "Invalid Date") && !isNaN(new Date(value));
  }
      fetch(`/admin/getSizes/${Data.id_shoe}`) // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      
      const valuesArray = data.map(size => size.value);
      const sizesContainer = document.getElementById('sizesContainer');
      sizesContainer.innerHTML = '';
      
      
      valuesArray.forEach(sizeValue => {
        const sizeSquare = document.createElement('div');
        sizeSquare.classList.add('sizeSquare');
        sizeSquare.textContent = sizeValue;
        sizeSquare.setAttribute('data-size', sizeValue);
      
        sizeSquare.addEventListener('click', function() {
          handleSizeSelection(sizeValue, sizeSquare);
        });
      
        sizesContainer.appendChild(sizeSquare);
      });
      
      console.log('Выбранный размер:', selectedSize);
      
      function handleSizeSelection(size, sizeSquare) {
        if (selectedSize === size) {
          // Если выбран тот же размер, снимаем выделение
          selectedSize = null;
          sizeSquare.classList.remove('selected');
        } else {
          // Если выбран новый размер, снимаем выделение с предыдущего и выделяем новый
          if (selectedSize !== null) {
            const prevSelectedSquare = sizesContainer.querySelector(`[data-size="${selectedSize}"]`);
            prevSelectedSquare.classList.remove('selected');
          }
          selectedSize = size;
          sizeSquare.classList.add('selected');
        }
      
        // Добавьте вашу логику обработки выбранного размера, например, внесение в базу данных
        console.log('Выбранный размер:', selectedSize);
      }
    
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });

    fetch(`/catalog/getReviews/${Data.id_shoe}`) // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      
      if (data.length > 0) {
          var thead = table.createTHead();
          var headerRow = thead.insertRow(0);

          // Задание собственных названий колонкам
          var columnNames = ['Логин пользователя', 'Текст', 'Дата', 'Время','Рейтинг'];

          columnNames.forEach(function (columnName) {
              var th = document.createElement("th");
              th.innerHTML = columnName;
              headerRow.appendChild(th);
          });
      }

      // Добавление строк с данными в tbody таблицы
      data.forEach(function (rowData) {
          addRow(table, rowData);
      });
    window.style.display = 'block';
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });

    OpenAddReviewBtn.onclick = function () {
      contentReview.style.display = 'block';
    }

    AddReviewBtn.onclick = function () {
      const currentDate = new Date();


  // Форматируем дату в формат YYYY-MM-DD
    const formattedDate = currentDate.toISOString().slice(0, 10);

  // Форматируем время в формат HH:MM
    const formattedTime = currentDate.toTimeString().slice(0, 8);
      const reviewData = {
        text: Rtext.value,
        rating:Rrating.value,
        date:formattedDate,
        time:formattedTime,
        id_shoe:Data.id_shoe,
      };
      fetch(`/catalog/addReview`, {
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
          Rtext.value='',
        Rrating.value=4,
          contentReview.style.display = 'none';
          table.innerHTML=''
          fetch(`/catalog/getReviews/${Data.id_shoe}`) // Замените '/your-api-endpoint' на фактический URL вашего API
          .then(response => response.json())
          .then(data => {
            // Обработка полученных данных
            console.log(data);
            
            if (data.length > 0) {
                var thead = table.createTHead();
                var headerRow = thead.insertRow(0);
      
                // Задание собственных названий колонкам
                var columnNames = ['Логин пользователя', 'Текст', 'Дата', 'Время','Рейтинг'];
      
                columnNames.forEach(function (columnName) {
                    var th = document.createElement("th");
                    th.innerHTML = columnName;
                    headerRow.appendChild(th);
                });
            }
      
            // Добавление строк с данными в tbody таблицы
            data.forEach(function (rowData) {
                addRow(table, rowData);
            });
          window.style.display = 'block';
          })
          .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            putmessage(`Ошибка загрузки данных: ${error.message}`);
          });

      });
    }
    

    submitBtn.onclick = function () {
      if (selectedSize ==null){
        alert("Выберете размер!")
        return
      }
        const backetData = {
          model_name:name.value,
          amount:amount.value,
          size:selectedSize,
        };
        
            fetch(`/catalog/addbacket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backetData),
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

              table.innerHTML=''
              loadData(choisenC);
          });
       
        
          
      }

    
   
  
  }
function bestsellers(){
    var window = document.getElementsByClassName('DateWindow')[0];
    var content = document.getElementsByClassName('DateWindow-content')[0];
    var submitBtn = document.getElementsByClassName('DateSubmit')[0];
    var closeBtn = document.getElementsByClassName('DateClose')[0]; 

    window.style.display = 'block';
 
    var start_dateC = content.querySelector('#start_date');
    var end_dateC = content.querySelector('#end_date');

    closeBtn.onclick = function () {
        window.style.display = 'none';
        start_dateC.value=''
        end_dateC.value=''
      };
    submitBtn.onclick = function () {
        const startDate = start_dateC.value;
        const endDate = end_dateC.value;
      
        // Проверяем, что дата начала раньше даты окончания
        if (new Date(startDate) >= new Date(endDate)) {
          console.error('Ошибка: Дата начала должна быть раньше даты окончания.');
          alert('Ошибка: Дата начала должна быть раньше даты окончания.');
          return; // Останавливаем выполнение функции
        } 
    fetch(`/catalog/getBestsellers/${start_dateC.value}/${end_dateC.value}`) // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      populateTable( data,choisenCategory)
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    })
    .finally(() => {
        var h = document.querySelector('.actionSpace div h1');
        if (h) {
          h.innerHTML = choisenC;
        }
        window.style.display = 'none';
        start_dateC.value=''
        end_dateC.value=''
        // loadData(choisenC);
    });
    }
}
function newShoe(){
    var window = document.getElementsByClassName('DateWindow')[0];
    var content = document.getElementsByClassName('DateWindow-content')[0];
    var submitBtn = document.getElementsByClassName('DateSubmit')[0];
    var closeBtn = document.getElementsByClassName('DateClose')[0]; 

    window.style.display = 'block';
 
    var start_dateC = content.querySelector('#start_date');
    var end_dateC = content.querySelector('#end_date');

    closeBtn.onclick = function () {
        window.style.display = 'none';
        start_dateC.value=''
        end_dateC.value=''
      };
    submitBtn.onclick = function () {
        const startDate = start_dateC.value;
        const endDate = end_dateC.value;
      
        // Проверяем, что дата начала раньше даты окончания
        if (new Date(startDate) >= new Date(endDate)) {
          console.error('Ошибка: Дата начала должна быть раньше даты окончания.');
          alert('Ошибка: Дата начала должна быть раньше даты окончания.');
          return; // Останавливаем выполнение функции
        } 
    fetch(`/catalog/getNewShoe/${start_dateC.value}/${end_dateC.value}`) // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      populateTable( data,choisenCategory)
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    })
    .finally(() => {
        var h = document.querySelector('.actionSpace div h1');
        if (h) {
          h.innerHTML = choisenC;
        }
        window.style.display = 'none';
        start_dateC.value=''
        end_dateC.value=''
        // loadData(choisenC);
    });
    }
}
function removeBucket(){
  console.log(choisenRowData)
  fetch(`/catalog/removeBucket/${choisenRowData.id_bucket_row}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        // Если код состояния успешный (2xx), обновите таблицу или выполните другие действия
        console.log(`Запись с id ${choisenRowData.id_bucket_row} успешно удалена.`);
        putmessage(`Запись с id ${choisenRowData.id_bucket_row} успешно удалена.`)
        loadData(choisenC);
        selectedRows= [];
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
function editBucket(){
  console.log(choisenRowData)
  var window = document.getElementsByClassName('editBucketWindow')[0];
  var content = document.getElementsByClassName('editBucketWindow-content')[0];
  var submitBtn = document.getElementsByClassName('editBucketSubmit')[0];
  var closeBtn = document.getElementsByClassName('editBucketClose')[0]; 
  const amount = content.querySelector('#amount');
  amount.value = choisenRowData.amount_of_shoes;
  window.style.display = 'block';
  closeBtn.onclick = function () {
    window.style.display = 'none';
    amount.value='';
  };
  submitBtn.onclick = function () {
    
    // Вы можете добавить дополнительные проверки для других полей, аналогично числовому полю

    const userData = {
      amount:amount.value,
    };

    fetch(`/catalog/updateBucket/${choisenRowData.id_bucket_row}`, {
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
        amount.value='';
        loadData(choisenC);
      });
  };
}
function buy(){
  console.log(selectedRows)
   if (selectedRows.length==0){
    alert("Выберите товары для заказа")
    return
   }
  var window = document.getElementsByClassName('buyWindow')[0];
  var content = document.getElementsByClassName('buyWindow-content')[0];
  var submitBtn = document.getElementsByClassName('buySubmit')[0];
  var closeBtn = document.getElementsByClassName('buyClose')[0]; 
  const cost = content.querySelector('#cost');
  var table = content.querySelector('#buyTable');

  const delivery_method = content.querySelector('#delivery_method');
  const adress = content.querySelector('#adress');

  closeBtn.onclick = function () {
    adress.value = ''
    window.style.display = 'none';
    table.innerHTML = '';
    cost.value='';
  };
  function addRow(table, rowData) {
    var row = table.insertRow();
    var values = Object.values(rowData);

    values.forEach(function (value, index) {
        var cell = row.insertCell();

        // Проверка, является ли значение датой

        cell.innerHTML = value;

    });
}

var data = selectedRows;
var desiredColumns = ['amount_of_shoes', 'size', 'model_name','cost','discounted_cost'];

// Функция для создания нового объекта без лишних свойств
function filterColumns(obj, columns) {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => columns.includes(key)));
}

// Создание нового массива данных с нужными колонками
var newData = data.map(item => filterColumns(item, desiredColumns));

var thead = table.createTHead();
var costv = 0;
  // Названия видимых столбцов

var headerRow = thead.insertRow(0);

// Задание собственных названий колонкам
var columnNames = ['Количество обуви', 'Размер', 'Название модели', 'Цена', 'Цена со скидкой'];

columnNames.forEach(function (columnName, index) {
    var th = document.createElement("th");
    th.innerHTML = columnName;
    headerRow.appendChild(th);

    // Если столбец не видим, добавляем класс "hidden-column" для скрытия

});

newData.forEach(function (rowData) {
    costv = rowData.discounted_cost + costv;
    // console.log(rowData.discounted_cost)
    addRow(table, rowData);
});
console.log(costv)
cost.value = costv
window.style.display = 'block';
submitBtn.onclick = function () {
  if (adress.value==''){
    alert('Заполните адрес')
    return
  }
  function getCommonOrderId() {
    if (selectedRows.length === 0) {
      // Если нет выбранных строк, вернем null или другое значение по умолчанию
      return null;
    }
  
    // Получаем значение id_order первой выбранной строки
    const firstOrderId = selectedRows[0].id_order;
  
    // Проверяем, чтобы id_order в каждой выбранной строке было равно firstOrderId
    const isSameOrder = selectedRows.every(row => row.id_order === firstOrderId);
  
    // Возвращаем id_order, если все строки имеют одинаковое значение, в противном случае null
    return isSameOrder ? firstOrderId : null;
  }
  
  // Пример использования
  const commonOrderId = getCommonOrderId();
  
  if (commonOrderId !== null) {
    console.log('Общее значение id_order:', commonOrderId);
  } else {
    alert('Выбранные строки имеют разные значения id_order')
    return;
  }
  const currentDate = new Date();


  // Форматируем дату в формат YYYY-MM-DD
    const formattedDate = currentDate.toISOString().slice(0, 10);

  // Форматируем время в формат HH:MM
    const formattedTime = currentDate.toTimeString().slice(0, 8);
  const OrderData = {
    cost: costv,
    date:formattedDate,
    time:formattedTime,
    delivery_method: delivery_method.value,
    adress: adress.value,
    
  };
  fetch(`/catalog/updateOrder/${commonOrderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(OrderData),
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

    const selectedRowsArray = Array.from(selectedRows);
    fetch(`/catalog/updateBucket_rows`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedRowsArray),
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
      fetch(`/catalog/updateOLDBucket_rows/${commonOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
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
        })
        .finally(() => {
          selectedRows=[]
          window.style.display = 'none';
          adress.value = ''

          table.innerHTML = '';
          cost.value='';
          loadData(choisenC);
        });
}
}
function chooseOrder(Data, row){
  var window = document.getElementsByClassName('BucketRowlistWindow')[0];
  var content = document.getElementsByClassName('BucketRowlistWindow-content')[0];
  var closeBtn = document.getElementsByClassName('BucketRowlistClose')[0]; 
  var table = content.querySelector('#OrderTable');
  fetch(`/catalog/getOrderList/${Data.order_id}`) // Замените '/your-api-endpoint' на фактический URL вашего API
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      console.log(data);
      function addRow(table, rowData) {
        var row = table.insertRow();
        var values = Object.values(rowData);
    
        values.forEach(function (value, index) {
            var cell = row.insertCell();
    
            // Проверка, является ли значение датой
    
            cell.innerHTML = value;
    
        });
    }
    
    var desiredColumns = ['amount_of_shoes', 'size', 'model_name','cost','discounted_cost'];
    
    // Функция для создания нового объекта без лишних свойств
    function filterColumns(obj, columns) {
      return Object.fromEntries(Object.entries(obj).filter(([key]) => columns.includes(key)));
    }
    
    // Создание нового массива данных с нужными колонками
    var newData = data.map(item => filterColumns(item, desiredColumns));
    
    var thead = table.createTHead();
    var costv = 0;
      // Названия видимых столбцов
    
    var headerRow = thead.insertRow(0);
    
    // Задание собственных названий колонкам
    var columnNames = ['Количество обуви', 'Размер', 'Название модели', 'Цена', 'Цена со скидкой'];
    
    columnNames.forEach(function (columnName, index) {
        var th = document.createElement("th");
        th.innerHTML = columnName;
        headerRow.appendChild(th);
    
        // Если столбец не видим, добавляем класс "hidden-column" для скрытия
    
    });
    
    newData.forEach(function (rowData) {
        costv = rowData.discounted_cost + costv;
        // console.log(rowData.discounted_cost)
        addRow(table, rowData);
    });
    })
    .catch(error => {
      console.error('Ошибка загрузки данных:', error);
      putmessage(`Ошибка загрузки данных: ${error.message}`);
    });

    window.style.display = 'block';
    
  closeBtn.onclick = function () {

    window.style.display = 'none';
    table.innerHTML = '';

  };
}function showRatingValue(input) {
  document.getElementById('ratingValue').innerText = input.value;
}

