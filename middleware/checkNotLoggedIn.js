// a function to check if the user is not logged in.
function checkNotLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // call in the next middleware in the stack
        return next();
    }
    // If not logged in and tries to access the dashboard, they will be redirected to the login page
    res.redirect('/login');
}
// export the middleware
module.exports = checkNotLoggedIn;
