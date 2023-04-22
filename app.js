const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, DB_ADDRESS } = require('./config');

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  // autoIndex: true,
});

const app = express();

app.use(helmet()); // подключаем защиту заголовков
app.use(cors({ origin: 'http://127.0.0.1:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов
app.use(routes); // подключаем роуты
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // ошибки при валидации на уровне роутов модуля celebrate
app.use(errorHandler); // ошибка созданная при работе сервера или общая(500)

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
