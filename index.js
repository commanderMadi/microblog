const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('express-flash');
const sqlite3 = require('sqlite3').verbose();
const methodOverride = require('method-override');
const errorHandler = require('./middleware/errorhandler');
require('dotenv').config();

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
    })
);

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

const authorRoutes = require('./routes/authorRoutes');

//set the app to use ejs for rendering
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(methodOverride('_method'));

app.use('/author', authorRoutes);
// app.use(errorHandler);

global.db = db;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
