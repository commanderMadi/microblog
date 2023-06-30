function checkNoAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/author/login');
}
module.exports = checkNoAuth;
