const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport) {
    const authenticateAuthor = (email, password, done) => {
        let query = `SELECT * FROM Authors WHERE author_email = ?`;
        db.all(query, [email], function (err, rows) {
            if (err) {
                throw err;
            }

            if (rows.length > 0) {
                const author = rows[0];

                if (password === author.author_password) {
                    return done(null, author);
                } else {
                    //password is incorrect
                    return done(null, false, {
                        message: 'Password is incorrect',
                    });
                }
            } else {
                // No user
                return done(null, false, {
                    message: 'No user with that email address',
                });
            }
        });
    };

    passport.use(
        new LocalStrategy(
            { usernameField: 'email', passwordField: 'password' },
            authenticateAuthor
        )
    );
    // Stores user details inside session. serializeUser determines which data of the user
    // object should be stored in the session. The result of the serializeUser method is attached
    // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
    //   the user id as the key) req.session.passport.user = {id: 'xyz'}
    passport.serializeUser((author, done) => {
        done(null, author.author_id);
    });

    // In deserializeUser that key is matched with the in memory array / database or any data resource.
    // The fetched object is attached to the request object as req.user

    passport.deserializeUser((id, done) => {
        db.all(`SELECT * FROM Authors WHERE author_id = ?`, [id], (err, rows) => {
            if (err) {
                return done(err);
            }
            return done(null, rows[0]);
        });
    });
}

module.exports = initialize;
