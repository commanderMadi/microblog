function errorHandler(errors, req, res, next) {
    if (errors) {
        req.flash('failure_msgs', errors);
        if (!req.originalUrl.includes('register')) {
            res.redirect(`${req.originalUrl}`);
        }
    }
}

module.exports = errorHandler;
