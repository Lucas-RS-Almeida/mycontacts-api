require('express-async-errors');
require('dotenv').config();

const express = require('express');

const app = express();

const cors = require('./middlewares/cors');

const routes = require('./routes');

const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use(cors);
app.use(routes);
app.use(errorHandler);

app.listen(process.env.PORT || 8080);
