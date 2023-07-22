// Require 3rd party dependencies
const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('express-flash');
const passport = require('passport');
const sqlite3 = require('sqlite3').verbose();
const methodOverride = require('method-override');

// Custom routes
const userLoginRoutes = require('./routes/userLoginRoutes');
const userRegisterRoutes = require('./routes/userRegisterRoutes');
const authorRoutes = require('./routes/authorRoutes');
const readerRoutes = require('./routes/readerRoutes');

// Custom error handling middleware
const errorHandler = require('./middleware/errorHandler');

// Passport authentication middleware
const initializePassport = require('./middleware/passportConfig');

// Configure the environment
require('dotenv').config();

// Initialize passport authentication
initializePassport(passport);

const app = express();

// set the port to fallback to 3000 if an environment variable is not supplied or is null.
const port = process.env.PORT || 3000;

// No need to use bodyparser with express version 4.16 and newer.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure the public directory path
app.use(express.static(__dirname + '/public'));

// Initialize the express session middelware
app.use(
    session({
        // Key we want to keep secret which will encrypt all of our information
        secret: process.env.SESSION_SECRET || 'WHEREISEVERYONEHIDING',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 86400000,
        },
    })
);

// Initialize the passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialize the express flash middleware
app.use(flash());
// Initialize the methodoverride middleware
// this middleware allows us to use methods like put, delete on the frontend to match with the route methods in the server
app.use(methodOverride('_method'));

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db', function (err) {
    if (err) {
        process.exit(1); //Bail out we can't connect to the DB
    } else {
        console.log('Database connected');
        global.db.run('PRAGMA foreign_keys=ON'); //This tells SQLite to pay attention to foreign key constraints
    }
});

//set the app to use ejs for rendering
app.set('view engine', 'ejs');

// Initialize the custom routes
app.use('/dashboard', authorRoutes);
app.use('/login', userLoginRoutes);
app.use('/register', userRegisterRoutes);
app.use('/', readerRoutes);

// Initialize the error handling middleware
app.use(errorHandler);

// A fallback route if a user tries to access a non-existent resource
// This will send a static HTML file with the code 404
app.get('*', (req, res) => {
    res.status(404).sendFile(__dirname + '/public/html/404.html');
});

// Make the db variable access in all other modules
global.db = db;

// start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server up and listening on port ${port}`);
});
