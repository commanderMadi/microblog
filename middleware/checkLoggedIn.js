// function to check if the user is logged in.
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If logged in and tries to access the login page, they will be redirected to the homepage
        res.redirect('/');
    }
    // call in the next middleware in the stack
    next();
}
// export the middleware
module.exports = checkLoggedIn;
