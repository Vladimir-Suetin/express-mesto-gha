const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/handleError');

const { PORT, DB_ADDRESS } = require('./config');

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  // autoIndex: true,
});

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://127.0.0.1:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
