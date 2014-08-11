var express = require('express');
var flash = require('connect-flash');
var router = express.Router();



/* GET user profile. */
router.get('/', ensureAuthenticated, function(req, res) {
    res.locals.errors = req.flash();
    console.log('request----', req.user);
   // console.log(req);
    console.log(res.locals);
    //  console.log('----------', req.user.username);
    // res.render('users', {
    //     errors: res.locals.errors
    // });
    res.send({
        username: req.user
    });
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    console.log('------------from user.js ----------------');
    console.log('req.user', req.user);
    var username = req.originalUrl.replace('/user/', '');
    if (req.isAuthenticated()) {
        return next();
    } else{
    res.send(401, {
        message: 'Please sign in'
    });	
    }
    


}

module.exports = router;
