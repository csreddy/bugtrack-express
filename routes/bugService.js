var express = require('express');
var flash = require('connect-flash');
var marklogic = require('marklogic');
var conn = require('../db-config.js').connection;
var db = marklogic.createDatabaseClient(conn);
var q = marklogic.queryBuilder;
var router = express.Router();


router.get('/count', function(req, res) {
    res.locals.errors = req.flash();
    console.log(res.locals.errors);
    db.query(
        q.where(
            q.collection('bugs')
        )
    ).result(function(response) {
        res.json({
            count: response.length
        });
    });

});

router.get('/:id(\\d+)', function(req, res) {
    res.locals.errors = req.flash();
    console.log(res.locals.errors);
    db.read(req.params.id + '.json').result(function(response) {
       // console.log(response[0]);
       console.log("SUCCESS");
       console.log(response);
       if (response.length === 1) {
       		res.json(response[0]);
       } else {
       		res.json({error: 'could not find the bug '+ req.params.id});
       }
    });
    });



router.get('/', function(req, res) {
    res.locals.errors = req.flash();
    console.log(res.locals.errors);
    res.json({
        count: 100
    });

});
module.exports = router;