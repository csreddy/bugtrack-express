tagging: http://sandglaz.github.io/bootstrap-tagautocomplete/
inplace editing : http://vitalets.github.io/x-editable/
editor: https://github.com/jhollingworth/bootstrap-wysihtml5/
typeahed : http://twitter.github.io/typeahead.js/
time range: http://www.dangrossman.info/2012/08/20/a-date-range-picker-for-twitter-bootstrap/
file upload: http://blueimp.github.io/jQuery-File-Upload/angularjs.html
jpg show: http://wolfslittlestore.be/jquery.bootstrap.simple.lightbox/
		  http://www.jasonbutz.info/bootstrap-lightbox/#usage


"1 - Drop everything and fix",
"2 - A customer is waiting for this",
"3 - Very important",
"4 - Important",
"5 - Fix if time permits",
"6 - Probably won’t fix but worth remembering",
"7 - Do not fix"


$("input[type='text']").each(function(){$(this).val('abcdefghij')});
$('textarea').each(function(){$(this).val('abcdefghij')});
$("select").each(function(){$(this).prop('selectedIndex', 1)})
$("input[type='radio']").first().val('Not Ready')



http://plnkr.co/edit/RQEM7So57zgRapoHHhqi?p=preview

curl --anyauth --user admin:admin -T ./config.json -i   -H "Content-type: application/json"   http://localhost:8003/v1/documents?uri=config.json

curl --anyauth --user admin:admin -T ./1000.json -i   -H "Content-type: application/json"   http://localhost:8003/v1/documents?uri=1000.json


app.use('/v1/', function(req, res, next) {
    'use strict';

    console.log('Request method =', req.method);
    var url = 'http://localhost:8003/v1' + req.url;
    console.log('url', url);
    if (req.method === 'GET') {
        req.pipe(request(url)).pipe(res);
    } else if (req.method === 'PUT') {
        console.log('----------------- start -----------------------');
        console.log('headers', req.headers);
        console.log('body', req.body);
        console.log('------------------- end ---------------------');

        //  console.log(JSON.stringify(req.body));
        request.put(url, req.body, function(err, response, body) {
            if (err) {
                next(err);
            }
            console.log('returned body');
            res.send(response.statusCode);
            next(res, res);
        });

        //  request.put(url, req.body);

    }


});