const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const session=require("express-session");
const helpers = require('./utils/helpers');
const dbConnection = require('./config/connection');
const SequelizeStore=require("connect-session-sequelize")(session.Store)
const app = express();
const PORT = process.env.PORT || 3001;

// Create the Handlebars.js engine object with custom helper functions
const hbs = exphbs.create({ helpers });

// Inform Express.js which template engine we're using
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
const sess = {
  name: "session",
  secret: "it is my blog keep the secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  store: new SequelizeStore({
    db: dbConnection,
  }),
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

dbConnection.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
