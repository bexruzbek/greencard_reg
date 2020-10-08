const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const connectDB = require('./config/db');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');

// Load config
dotenv.config({ path: './config/config.env' });

// Connect to db
connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const store = new MongoStore({
  collection: 'sessions',
  uri: process.env.MONGO_URI
});

// Handlebars
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);
app.set('view engine', '.hbs');

// File Upload
app.use(fileupload());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));

// Middlewares
app.use(varMiddleware);

// Routes
app.use('/', require('./routes/home'));
app.use('/admin', require('./routes/admin'));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);