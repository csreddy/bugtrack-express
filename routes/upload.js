var express = require('express');
var flash = require('connect-flash');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    var response = {body:req.body, file: req.files};
   	res.send('200', response);
});
module.exports = router;