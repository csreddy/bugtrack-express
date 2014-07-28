var express = require('express');
var flash = require('connect-flash');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.locals.errors = req.flash();
    console.log('request----', req.user);
    console.log(res.locals);
    //  console.log('----------', req.user.username);
    // res.render('users', {
    //     errors: res.locals.errors
    // });
    res.send(req.user);
});
module.exports = router;