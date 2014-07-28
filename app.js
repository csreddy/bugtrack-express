var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');


var routes = require('./routes/index');
var user = require('./routes/user');
var login = require('./routes/login');


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));


app.use(session({
    name: 'test',
    secret: 'mysecret',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 604800 // one week
    }
}));

console.log('starting express.......');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);
app.use('/user', user);
app.use('/login', login);


// authentication
passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user.username);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
    // database.login(username, password, done);
    //  request.get('http://localhost:8003/v1/search').auth('username', 'password', false);

    //  var username = 'admin',
    //     password = 'admin',
    var url = 'http://' + username + ':' + password + '@localhost:8003/v1/search';
    var userURI = 'http://localhost:8003/v1/documents?uri=/user/' + username + '.json';

    /*function checkUserExists(uri) {
        app.use('userURI', function(req, res) {
            req.pipe(request(url)).pipe(res);
        });
    }

    function checkPwdMatch(uri) {
        request
    }*/

    var options = {
        method: 'GET',
        url: userURI
    };
    request(options, function(error, response, body) {
        body = JSON.parse(body);
        console.log('response = ', typeof body);
        if (response.statusCode === 404) {
            return done(null, false, {
                status: 404,
                message: 'User does not exist'
            });
        } else if (response.statusCode === 200) {
            console.log('body.password = ', body.password);
            console.log('password = ', password);
            if (body.password === password) {
                return done(null, {
                    status: 200,
                    username: username
                });
            } else {
                return done(null, false, {
                    status: 401,
                    message: 'Incorrect password.'
                });
            }
        } else {
            return done(error);
        }
    });



    /*request({
        url: url,
        sendImmediately: false
    }, function(error, response, body) {
        console.log(response.statusCode);
        if (response.statusCode === 401) {
            console.log('Incorrect password ................');
            return done(null, false, {
                status: 401,
                message: 'Incorrect password.'
            });
        } else if (response.statusCode === 403) {
            console.log('no privilages');
            return done(null, false, {
                status: 403,
                message: 'You do not have privilages.'
            });
        } else if (response.statusCode === 404) {
            console.log('User does not exist................');
            return done(null, false, {
                status: 404,
                message: 'User does not exist'
            });
        } else if (response.statusCode === 200) {
            console.log('auth success................');
            return done(null, {
                status: 200,
                username: username
            });
        } else {
            console.log('auth failed');
        };
    });*/

    /*  if (username === 'admin' && password === 'admin') {
        console.log('in');
        done(null, {
            username: username
        });
    } else {
        done(null, false, {
            message: 'Incorrect password.'
        });
    }*/

}));


// api calls
app.use('/v1/', function(req, res, next) {
    'use strict';
    var url = 'http://localhost:8003/v1' + req.url;
    if (req.method === 'GET') {
        req.pipe(request(url)).pipe(res);
    } else if (req.method === 'PUT') {
        console.log('body:', req.body);

        var options = {
            method: 'PUT',
            url: url,
            body: req.body,
            json: true
        };
        request(options, function(err, response, body) {
            if (err) {
                next(err);
            }

            res.send(response); // res.send(response.statusCode, response);  
            console.log(response);
            next(res, res);
        });
    }
});


// login
/*app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.send(req.user);
    }, function(req, res) {
        console.log('failed.....');
        res.send(req.statusCode);
    });*/

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.messages = [info.message];
            return res.send(401, info);
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.send(req.user);
        });
    })(req, res, next);
});


// logout
app.get('/logout', function(req, res) {
    req.logout();
    console.log('logged out');
    res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send(401, {
        message: 'Please sign in'
    });
}

module.exports = app;