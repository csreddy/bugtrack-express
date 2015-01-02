var express = require('express');
var flash = require('connect-flash');
var marklogic = require('marklogic');
var conn = require('../db-config.js').connection;
var db = marklogic.createDatabaseClient(conn);
var q = marklogic.queryBuilder;
var router = express.Router();
var maxLimit = 99999999;


router.post('/', function(req, res) {
    // if (!req.user) {
    // 	res.redirect("/#/login");
    // };
    console.log('CALLED /SEARCH------------------');
    res.locals.errors = req.flash();
    // console.log(res.locals.errors);
    var result = {};
    var criteria = req.body;
    var searchCriteria = [];
    // when empty criteria is sent 
    if (Object.keys(criteria).length === 0) {
        searchCriteria = [q.collection('bugs')];
    }



    for (var key in criteria) {
        var orQuery = [];
        var value = criteria[key];

        switch (key) {
            case 'q':
                searchCriteria.push(q.parsedFrom(value));
                break;
            case 'kind':
                var collectionName;
                for (var index in value) {
                    switch (value[index].name) {
                        case 'Bug':
                            collectionName = 'bugs';
                            if (value[index].value) {
                                orQuery.push(q.collection(collectionName));
                                searchCriteria.push(q.or(orQuery));
                            }
                            break;
                        case 'Task':
                            collectionName = 'tasks';
                            if (value[index].value) {
                                orQuery.push(q.collection(collectionName));
                                searchCriteria.push(q.or(orQuery));
                            }
                            break;
                        case 'RFE':
                            collectionName = 'rfes';
                            if (value[index].value) {
                                orQuery.push(q.collection(collectionName));
                                searchCriteria.push(q.or(orQuery));
                            }
                            break;
                        case 'Other':
                            collectionName = 'others';
                            if (value[index].value) {
                                orQuery.push(q.collection(collectionName));
                                searchCriteria.push(q.or(orQuery));
                            }
                            break;
                        default:
                            // collectionName = 'bugs';
                            // if (value[index].value) {
                            //     orQuery.push(q.collection(collectionName));
                            // }
                            break;
                    }
                    //searchCriteria.push(q.or(orQuery));
                }
                break;
            case 'status':
            case 'severity':
                for (var index in value) {
                    if (value[index].value && value[index].name !== 'n/v/f/e') {
                        orQuery.push(q.value(key, value[index].name));
                    }
                }
                if (orQuery.length > 0) {
                    searchCriteria.push(q.or(orQuery));
                }
                break;
            case 'assignTo':
            if (value !== '') {
                searchCriteria.push(q.range(q.pathIndex('/assignTo/username'), q.datatype('string'), '=', value));    
            }   
                break;
            case 'submittedBy':
            if (value !== '') {
                searchCriteria.push(q.range(q.pathIndex('/submittedBy/username'), q.datatype('string'), '=', value));
            }
                break;
            case 'category':
            case 'version':
            case 'fixedin':
            case 'tofixin':
            if (value !== '') {
                   searchCriteria.push(q.value(key, value));
            }
                break;
            case 'facets':
                var keys = Object.keys(value);
                if (keys.length > 0) {
                    keys.forEach(function(item) {
                        if (item === 'submittedBy') {
                            searchCriteria.push(q.range(q.pathIndex('/submittedBy/name'), q.datatype('string'), '=', value[item].name));
                            // searchCriteria.push(q.value(q.pathIndex('/submittedBy/username'), value[item].name));
                        } else if (item === 'assignTo') {
                            searchCriteria.push(q.range(q.pathIndex('/assignTo/name'), q.datatype('string'), '=', value[item].name));
                            // searchCriteria.push(q.value(q.pathIndex('/assignTo/username'), value[item].name));
                        } else if (item === 'priority') {
                            searchCriteria.push(q.range(q.pathIndex('/priority/level'), q.datatype('string'), '=', value[item].name));
                            // searchCriteria.push(q.value(q.pathIndex('/priority/level'), value[item].name));
                        } else {
                            searchCriteria.push(q.range(item, '=', value[item].name));
                            // searchCriteria.push(q.value(item, value[item].name));
                        }
                    });
                }
                break;
              default:
              break;  
        }

        console.log('--------------- ' + key + '--------------------');
    }



    // get results
    db.documents.query(
        q.where(
            searchCriteria
        )
        .orderBy(
            q.sort('id', 'ascending')
        )
        .calculate(
            q.facet('kind', 'kind'),
            q.facet('status', 'status'),
            q.facet('category', 'category'),
            q.facet('severity', 'severity'),
            q.facet('version', 'version'),
            q.facet('platform', 'platform'),
            q.facet('fixedin', 'fixedin'),
            q.facet('submittedBy', q.pathIndex('/submittedBy/name')), // server crashes if enabled
            q.facet('assignTo', q.pathIndex('/assignTo/name')),
            q.facet('priority', q.pathIndex('/priority/level'))
        )
        .slice(1, maxLimit)
        .withOptions({
            debug: true,
            queryPlan: true,
            metrics: true,
            category: 'contents',
            view: 'facets'
        })
    ).result(function(response) {
        // console.log(response);
        // console.log('/search', req.body);
        result = response;
        res.status(200).json(result);
    }, function(error) {
        res.status(500).json(error);
    });
});

router.get('/all', function(req, res) {
    res.locals.errors = req.flash();
    console.log(res.locals.errors);
    var result = {};

    db.documents.query(
        q.where(
            q.collection('bugs')
        )
        .slice(1, maxLimit)
        .orderBy(
            q.sort('id', 'ascending')
        )
        .withOptions({
            debug: true,
            metrics: true,
            category: 'contents',
            view: 'facets'
        })
    ).result(function(response) {
        //  console.log(response);
        result = response;
        res.status(200).json(result);
    }, function(error) {
        res.status(500).json(error);
    });

});



router.post('/test', function(req, res) {
    //console.log('---------------', req);
    var result = {};
    db.documents.query(
        q.where(
            q.collection('bugs'),
            q.range(q.pathIndex('/assignTo/username'), '=', req.body.assignTo)
        )
        .slice(1, maxLimit)
    ).result(function(response) {
        console.log(response);
        result = response.length;
        res.status(200).json(result);
    }, function(error) {
        res.status(500).json(error);
    });
});

module.exports = router;