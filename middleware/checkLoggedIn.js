function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        res.redirect('/');
    }
    next();
}

module.exports = checkLoggedIn;
