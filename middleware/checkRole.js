// a function to check the user role.
function checkRole(req, res, next) {
    // If the user who is logged in is an author and tries to access the dasbhoard, the dashboard will render
    if (req.user.user_role === 'Author') {
        // call in the next middleware in the stack
        return next();
    }
    // If the logged in user is not an author, they will be redirected to the homepage
    res.redirect('/');
}
// export the middleware
module.exports = checkRole;
