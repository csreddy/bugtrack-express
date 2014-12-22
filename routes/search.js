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
    // when empty criteira is sent 
    if (!criteria.keys) {
        searchCriteria = [q.collection('bugs')];
    }
    

    var orQuery = [];
    for (var key in criteria) {
        var value = criteria[key];

        if (key === 'q') {
            searchCriteria.push(q.parsedFrom(value));
        }
        // set collection
        if (key === 'kind') {
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
                        collectionName = 'bugs';
                        if (value[index].value) {
                            orQuery.push(q.collection(collectionName));
                            searchCriteria.push(q.or(orQuery));
                        }
                }
            }
        }


        if (key === 'status' || key === 'severity') {
            for(var index in value){
                if(value[index].value){
                    orQuery.push(q.value(key, value[index].name));
                    searchCriteria.push(q.or(orQuery));
                }
            }
        }

    


        if (typeof value === 'string' && key !== 'q' && value !== '') {
            if (key === 'assignTo') {
                searchCriteria.push(q.range(q.pathIndex('/assignTo/username'), q.datatype('string'), '=', value));
                //  searchCriteria.push(q.value(q.pathIndex('/assignTo/username'), value));
            } else if (key === 'submittedBy') {
                searchCriteria.push(q.range(q.pathIndex('/submittedBy/username'), q.datatype('string'), '=', value));
                //  searchCriteria.push(q.value(q.pathIndex('/submittedBy/username'), value));
            } else {
                searchCriteria.push(q.value(key, value));
            }
        }

        if (key !== 'facets' && typeof value === 'object' && Object.keys(value).length > 0) {
            var keys = Object.keys(value);
            keys.forEach(function(item) {
                if (value[item] === true) {
                    orQuery.push(q.value(key, item));
                    searchCriteria.push(q.or(orQuery));
                }
            });

            orQuery = [];
        }

        // for facets
        if (key === 'facets' && Object.keys(value).length > 0) {
            var keys = Object.keys(value);
            keys.forEach(function(item) {
                if (item === 'submittedBy') {
                    searchCriteria.push(q.range(q.pathIndex('/submittedBy/name'), q.datatype('string'), '=', value[item].name));
                    //  searchCriteria.push(q.value(q.pathIndex('/submittedBy/username'), value[item].name));
                } else if (item === 'assignTo') {
                    searchCriteria.push(q.range(q.pathIndex('/assignTo/name'), q.datatype('string'), '=', value[item].name));
                    //  searchCriteria.push(q.value(q.pathIndex('/assignTo/username'), value[item].name));
                } else if (item === 'priority') {
                    searchCriteria.push(q.range(q.pathIndex('/priority/level'), q.datatype('string'), '=', value[item].name));
                    //searchCriteria.push(q.value(q.pathIndex('/priority/level'), value[item].name));
                } else {
                    //searchCriteria.push(q.range(item, '=', value[item].name));
                    searchCriteria.push(q.value(item, value[item].name));
                }
            });
        }


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