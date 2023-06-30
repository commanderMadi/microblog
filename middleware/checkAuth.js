function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/author/dashboard/articles');
    }
    next();
}

module.exports = checkAuth;
