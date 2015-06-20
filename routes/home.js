var express = require('express');
var router = express.Router();

router.get('/home',function(req, res, next){
	res.render('index');
	next();
});

module.exports = router;