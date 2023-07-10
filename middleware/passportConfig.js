const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        let query = `SELECT * FROM Users WHERE user_email = ?`;
        db.all(query, [email], function (err, rows) {
            if (err) {
                throw err;
            }
            if (rows.length > 0) {
                const user = rows[0];
                bcrypt.compare(password, user.user_password, (err, matched) => {
                    if (matched) {
                        return done(null, user);
                    } else {
                        if (password === user.user_password) {
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                message: 'Incorrect password. Try again!',
                            });
                        }
                        //password is incorrect
                    }
                });
            } else {
                // No user found in DB
                return done(null, false, {
                    message: 'No user with that email address!',
                });
            }
        });
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser));
    // Stores user details inside session. serializeUser determines which data of the user
    // object should be stored in the session. The result of the serializeUser method is attached
    // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
    //   the user id as the key) req.session.passport.user = {id: 'xyz'}
    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    // In deserializeUser that key is matched with the in memory array / database or any data resource.
    // The fetched object is attached to the request object as req.user

    passport.deserializeUser((id, done) => {
        db.all(`SELECT * FROM Users WHERE user_id = ?`, [id], (err, rows) => {
            if (err) {
                return done(err);
            }
            return done(null, rows[0]);
        });
    });
}

module.exports = initialize;
