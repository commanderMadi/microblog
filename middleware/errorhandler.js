const errorHandler = (err, req, res, next) => {
    if (err) {
        res.sendStatus(400);
        return;
    }
    next();
};

module.exports = errorHandler;
