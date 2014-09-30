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
var multer = require('multer');
var marklogic = require('marklogic');
var conn = require('./db-config.js').connection;
var db = marklogic.createDatabaseClient(conn);
var fs = require('fs');


var routes = require('./routes/index');
var user = require('./routes/user');
var login = require('./routes/login');
var upload = require('./routes/upload');


var app = express();
app.use(multer({
    dest: './uploads/'
}));
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
        maxAge: 3600000
        //  expires: new Date(Date.now() + 30) //expires after 1 hour 3600000
    }
}));

console.log('starting express.......');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', routes);
app.use('/user/:username', user);
app.use('/login', login);
//app.use('/upload', upload);


// authentication
passport.serializeUser(function(user, done) {
    console.log('serializeUser:', user);
    done(null, user.username);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
    var url = 'http://' + username + ':' + password + '@localhost:8003/v1/search';
    var userURI = 'http://localhost:8003/v1/documents?uri=/user/' + username + '.json';

    var options = {
        method: 'GET',
        url: userURI
    };
    request(options, function(error, response, body) {
        if (error) {
            return done(null, false, {
                status: 503,
                message: 'Database connection refused'
            });
        }

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

}));

process.on('uncaughtException', function(err) {
    console.error('uncaughtException: ' + err.message);
    console.error('ERROR', err.stack);
    process.exit(1); // exit with error
});


// api calls
app.use('/v1/', function(req, res, next) {
    'use strict';

    function handleConnRefused(err, resp, body) {
        if (err.code === 'ECONNREFUSED') {
            console.error('Refused connection');
            next(err);
        } else {
            throw err;
        }
    }
    var url = 'http://localhost:8003/v1' + req.url;

    switch (req.method) {
        case 'GET':
            req.pipe(request(url, function(error, response, body) {
                if (error) {
                    next(error);
                }
            })).pipe(res);
            break;
        case 'PUT':
            var options = {
                method: 'PUT',
                url: url,
                body: req.body,
                json: true
            };

            req.pipe(request(options, function(error, response, body) {
                if (error) {
                    next(error);
                }
            })).pipe(res);
            break;
        case 'POST':
            console.log('its a POST');
            var url = 'http://localhost:8003/v1/documents?extension=json';
            var options = {
                method: 'POST',
                headers: req.headers,
                url: url,
                body: JSON.stringify(req.body)
            };

            req.pipe(request(options, function(error, response, body) {
                if (error) {
                    next(error);
                }
            })).pipe(res);
            break;
        default:
            console.log('nothing to do');
    }



    /*    if (req.method === 'GET') {
        req.pipe(request(url, function(error, response, body) {
            if (error) {
                next(error);
            }
        })).pipe(res);
    } else if (req.method === 'PUT') {
        //console.log('request:', req);

        var options = {
            method: 'PUT',
            url: url,
            body: req.body,
            json: true
        };

        req.pipe(request(options, function(error, response, body) {
            if (error) {
                next(error);
            }
        })).pipe(res);
    }*/

});

app.get('/userinfo', function(req, res) {
    console.log('===================== req.user', req.user);
    // req.user = "admin";
    var url = 'http://localhost:8003/v1/documents?uri=/user/' + req.user + '.json';
    console.log('URL ==== ', url);
    request(url, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var bodyObj = JSON.parse(body);
            delete bodyObj.password;
            delete bodyObj.createdAt;
            delete bodyObj.modifiedAt;
            res.send(bodyObj);
        } else {
            res.send(401, {
                message: 'Please sign in'
            });
        }

    });
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
            console.log('from /login post', req.user);
            return res.send(req.user);
        });
    })(req, res, next);
});


// logout
app.get('/logout', function(req, res, next) {
    /*  this is not working 
   http://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout
   req.logout();  
    console.log('logged out');
    res.redirect('/#/login');
    */

    req.session.destroy(function(err) {
        res.redirect('/#/login'); //Inside a callback… bulletproof!
    });
});

app.post('/new', function(req, res, next) {
    console.log('inside NEW.........');
    console.log('BODY', req.body);
    console.log('FILES', req.files);
    var attachments = req.files;
    var errors = false;

    db.write([{
        uri: JSON.parse(req.body.bug).id + '.json',
        category: 'content',
        contentType: 'application/json',
        collections: ['bugs', req.user],
        content: req.body.bug
    }]).result(function(response) {
        console.log('wrote:\n    ' +
            response.documents.map(function(document) {
                return document.uri;
            }).join(', ')
        );
        console.log('done\n');
        res.send(200);
    });

    for (var file in attachments) {
        console.log(attachments[file]);
        if (attachments[file].mimetype === "image/svg+xml") {
             errors = true;
            break;
        }
        var doc = {
            uri: '/tmp/' + attachments[file].originalname,
            category: 'content',
            contentType: attachments[file].mimetype
        };

        var writableStream = db.createWriteStream(doc);
        writableStream.result(function(response) {
            console.log('wrote:\n ' + response.documents[0].uri);
        }, function(error) {
            console.log('file upload failed');
            errors = true;
            res.send(400, {
                message: 'file upload failed. Try again'
            });
        });
        fs.createReadStream(attachments[file].path).pipe(writableStream);
    }



});


app.get('/upload', function(req, res) {
    res.sendfile('views/upload.html');
});

app.post('/upload', function(req, res, next) {
    var url = 'http://localhost:8003/v1/documents';
    console.log('BODY', req.body);
    console.log('FILES', req.files);

    req.headers['content-type'] = req.headers['content-type']
        .replace('multipart/form-data',
            'multipart/mixed');
    console.log('HEADERS', req.headers);

    console.log(res.attachment(req.files.file_upload[0].path));
    console.log(res.attachment(req.files.file_upload[1].path));
    console.log(res._headers);

    console.log(req.body);

    var options = {
        method: 'POST',
        url: url,
        multipart: []
    };

    req.pipe(request(options, function(error, response, body) {
        if (error) {
            console.log(error);
            next(error);
        }
    })).pipe(res);
    //  res.send(JSON.stringify(req.files));
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