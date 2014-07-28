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
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


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

    request({
        url: url,
        sendImmediately: false
    }, function(error, response, body) {
        console.log(response.statusCode);
        if (response.statusCode === 401) {
            console.log('Incorrect password ................');
            done(null, false, {
                message: 'Incorrect password.'
            });
        } else if (response.statusCode === 403) {
            console.log('no privilages');
            done(null, false, {
                message: 'you do not have privilages.'
            });
        } else if (response.statusCode === 200) {
            console.log('auth success................');
            done(null, {
                username: username
            });
        } else {
            console.log('auth failed');
        };
    });

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

// login
app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.send(req.user);
    });


// logout
app.get('/logout', function(req, res) {
    req.logout();
    console.log('logged out');
    res.redirect('/');
});

// api calls
app.use('/v1/', function(req, res, next) {
    'use strict';
    var url = 'http://localhost:8003/v1' + req.url;
    if (req.method === 'GET') {
        req.pipe(request(url)).pipe(res);
    } else if (req.method === 'PUT') {
        //   console.log('body:', req.body);

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
            res.send(response);
            next(res, res);
        });
    }
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

module.exports = app;