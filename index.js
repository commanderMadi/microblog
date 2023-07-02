const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('express-flash');
const passport = require('passport');
const sqlite3 = require('sqlite3').verbose();
const methodOverride = require('method-override');
const errorHandler = require('./middleware/errorhandler');
const loginRoutes = require('./routes/loginRoutes');
const authorRoutes = require('./routes/authorRoutes');
const readerRoutes = require('./routes/readerRoutes');
const initializePassport = require('./middleware/passportConfig');

require('dotenv').config();
initializePassport(passport);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(
    session({
        // Key we want to keep secret which will encrypt all of our information
        secret: process.env.SESSION_SECRET,
        // Should we resave our session variables if nothing has changes which we dont
        resave: false,
        // Save empty value if there is no vaue which we do not want to do
        saveUninitialized: false,
        cookie: {
            maxAge: 86400000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db', function (err) {
    if (err) {
        console.error(err);
        process.exit(1); //Bail out we can't connect to the DB
    } else {
        console.log('Database connected');
        global.db.run('PRAGMA foreign_keys=ON'); //This tells SQLite to pay attention to foreign key constraints
    }
});

//set the app to use ejs for rendering
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use('/login', loginRoutes);
app.use('/dashboard', authorRoutes);
app.use('/', readerRoutes);

// app.use(errorHandler);

global.db = db;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
