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
	for (var key in criteria) {
		var value = criteria[key];

		if (key === 'q') {
			conditions.push(q.parsedFrom(value));
		}

		if (typeof value === 'string' && key !== 'q' && value !== '') {
			if (key === 'assignTo') {
				conditions.push(q.range(q.pathIndex('/assignTo/username'), '=', value));
			} else if (key === 'submittedBy') {
				conditions.push(q.range(q.pathIndex('/submittedBy/username'), '=', value));
			} else {
				conditions.push(q.value(key, value));
			}
		}

		if (key !== 'facets' && typeof value === 'object' && Object.keys(value).length > 0) {
			var keys = Object.keys(value);
			keys.forEach(function(item) {
				if (value[item] === true) {
					orQuery.push(q.value(key, item));
				}
			});
			conditions.push(q.or(orQuery));
			orQuery = [];
		}

		// for facets
		if (key === 'facets' && Object.keys(value).length > 0) {
			var keys = Object.keys(value);
			keys.forEach(function(item) {
				if (item === 'submittedBy') {
					conditions.push(q.range(q.pathIndex('/submittedBy/name'), '=', value[item].name));	
				} else if (item === 'assignTo') {
					conditions.push(q.range(q.pathIndex('/assignTo/name'), '=', value[item].name));	
				} else if(item === 'priority'){
					conditions.push(q.range(q.pathIndex('/priority/level'), '=', value[item].name));	
				} else{
					conditions.push(q.range(item, '=', value[item].name));	
				}
			});
		}


	}

	// get results
	db.query(
		q.where(
			conditions
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
			q.facet('submittedBy', q.pathIndex('/submittedBy/name')),
			//  q.facet('assignedTo', q.pathIndex('/assignTo/name')),
			q.facet('priority', q.pathIndex('/priority/level'))
		)
		.slice(1, maxLimit)
		.withOptions({
			queryPlan: true,
			metrics: true,
			category: 'contents',
			view: 'facets'
		})
	).result(function(response) {
		console.log(response);
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

	db.query(
		q.where(
			q.collection('bugs')
		)
		.slice(1, maxLimit)
		.orderBy(
			q.sort('id', 'ascending')
		)
		.withOptions({
			metrics: true,
			category: 'contents',
			view: 'facets'
		})
	).result(function(response) {
		console.log(response);
		result = response;
		res.status(200).json(result);
	}, function(error) {
		res.status(500).json(error);
	});

});

module.exports = router;