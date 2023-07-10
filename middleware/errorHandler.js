function errorHandler(errors, req, res, next) {
    if (errors) {
        req.flash('failure_msgs', errors);

        res.redirect(`${req.originalUrl}`);
    }
}

module.exports = errorHandler;
