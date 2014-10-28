var express = require('express');
var flash = require('connect-flash');
var marklogic = require('marklogic');
var conn = require('../db-config.js').connection;
var db = marklogic.createDatabaseClient(conn);
var q = marklogic.queryBuilder;
var router = express.Router();
var maxLimit = 99999999;


router.post('/', function(req, res) {
    res.locals.errors = req.flash();
    console.log(res.locals.errors);
    var result = {};
    var criteria = req.body;
    var conditions = [q.collection('bugs')];
    var orQuery = [];
    for (var value in criteria) {
        if (criteria && criteria[value] !== '' && criteria[value] !== '? undefined:undefined ?') {
            if (criteria[value] instanceof Array) {
                criteria[value].forEach(function(item) {
                    orQuery.push(q.value(value, item));
                });
                conditions.push(q.or(orQuery));
            } else if (value === 'q') {
                conditions.push(q.parsedFrom(criteria[value]));
            } else {
                conditions.push(q.value(value, criteria[value]));
            }
        }
    }
    // get results
    db.query(
        q.where(
            conditions
        )
        .slice(1, maxLimit)
        .withOptions({
            queryPlan: true,
            metrics: true,
            category: 'contents'
        })
    ).result(function(response) {
        console.log(response);
        result = response;
        res.json(result);
    });


});
module.exports = router;
