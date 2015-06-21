var express = require('express');
var router = express.Router();

/**
 * 起始路由
 */
router.get('/home',function(req, res, next){
	res.render('index');
	next();
});

/**
 * 获取某个类型的所有文件或目录
 */
router.get('/category/:type', function(res, req, next) {
	next();
})

/**
 * 创建新目录
 */
router.post('/api/create', function(res, req, next) {
	next();
});

/**
 * 重命名文件目录
 */
router.post('/api/rename', function(res, req, next) {
	next();
});

/**
 * 删除某个文件或目录
 */
router.post('/api/delete', function(res, req, next) {
	next();
});

module.exports = router;