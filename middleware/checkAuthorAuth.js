function checkAuthorAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
}

module.exports = checkAuthorAuth;
