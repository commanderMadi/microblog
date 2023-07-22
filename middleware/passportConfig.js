// Require 3rd party dependencies
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Passport initialization function
// Following the passport documentation
// https://www.passportjs.org/concepts/authentication/strategies/
function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        let query = `SELECT * FROM Users WHERE user_email = ?`;
        db.all(query, [email], function (err, rows) {
            if (err) {
                throw err;
            }
            // If we found users in the database, proceed with the login authentication process
            if (rows.length > 0) {
                // obtain the user details
                const user = rows[0];
                bcrypt.compare(password, user.user_password, (err, matched) => {
                    if (matched) {
                        // if the password supplied matches the hashed password stored in the db, authenticate the user
                        return done(null, user);
                    } else {
                        // if the password is correct and it is a first time login password for the author, authenticate the author
                        if (password === user.user_password) {
                            return done(null, user);
                        } else {
                            //if the supplied password is incorrect, display an error message
                            return done(null, false, {
                                message: 'Incorrect password. Try again!',
                            });
                        }
                    }
                });
            } else {
                // If we found no usres in the database, return a message to reflect this
                return done(null, false, {
                    message: 'No user with that email address!',
                });
            }
        });
    };

    // utilize the local strategy to proceed with the authentication process
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser));

    // serializeUser stores the user ID in the session and persist the data
    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    // deserializeUser is used to retrieve user data from session.

    passport.deserializeUser((id, done) => {
        db.all(`SELECT * FROM Users WHERE user_id = ?`, [id], (err, rows) => {
            if (err) {
                return done(err);
            }
            return done(null, rows[0]);
        });
    });
}

// export the middleware
module.exports = initialize;
