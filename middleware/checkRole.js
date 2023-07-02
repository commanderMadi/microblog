function checkRole(req, res, next) {
    if (req.user.user_role === 'Author') {
        return next();
    }
    res.redirect('/');
}
module.exports = checkRole;
