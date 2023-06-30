const express = require('express');
const router = express.Router();
const assert = require('assert');

router.get('/', (req, res, next) => {
    res.send('hi');
});

module.exports = router;
