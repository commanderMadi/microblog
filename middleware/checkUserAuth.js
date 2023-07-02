function checkUserAuth(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(res);

        return res.redirect('/');
    }
    next();
}

module.exports = checkUserAuth;
