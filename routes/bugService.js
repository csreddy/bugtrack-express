var express = require('express');
var flash = require('connect-flash');
var marklogic = require('marklogic');
var conn = require('../db-config.js').connection;
var db = marklogic.createDatabaseClient(conn);
var q = marklogic.queryBuilder;
var router = express.Router();
var maxLimit = 99999999;

router.get('/count', function(req, res) {
    res.locals.errors = req.flash();
    console.log(res.locals.errors);

    db.query(
        q.where(
            q.collection('bugs')
        )
        .slice(1,maxLimit)
        .withOptions({
          categories: 'metadata'
        })
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


router.get('/facets', function(req, res) {
    res.locals.errors = req.flash();
    console.log(res.locals.errors);
   var facets = {};
// get facets
    db.query(
        q.where(
            q.collection('bugs')
          )
        .calculate(
          q.facet('Kind', 'kind'),
          q.facet('Status', 'status'),
           q.facet('Category', 'category'),
           q.facet('Severity', 'severity'),
           q.facet('Version', 'version'),
           q.facet('Platform', 'platform'),
           q.facet('Fixed_In', 'fixedin'),
            q.facet('Submitted_By', q.pathIndex('/submittedBy/name')),
          //  q.facet('Assigned_To', q.pathIndex('/assignTo/name')),
           q.facet('Priority', q.pathIndex('/priority/level'))
          )
        .slice(1,maxLimit)
        .withOptions({
          view: 'facets'
        })
        ).result(function(response) {
          console.log(response);
            facets = response[0];
             res.json(facets);
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