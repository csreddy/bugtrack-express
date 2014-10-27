var express = require('express');
var flash = require('connect-flash');
var router = express.Router();

router.post('/', function(req, res) {
    res.locals.errors = req.flash();
    console.log(req);
    res.json(req.body);
});

module.exports = router;