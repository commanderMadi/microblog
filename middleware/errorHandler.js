// A middleware that is used an error handler if any route experienced an error
// Related error messages will be displayed on the same page where the error occurred
function errorHandler(errors, req, res, next) {
    if (errors) {
        req.flash('failure_msgs', errors);

        res.redirect(`${req.originalUrl}`);
    }
}

module.exports = errorHandler;
