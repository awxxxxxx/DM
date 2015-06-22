var express = require('express');
var router = express.Router();
var fileManager = require('../lib/fileManager.js');
var basePath;

router.all('*', function (req, res, next) {
	basePath = req.headers.basepath;
	//res.send(basePath);
	next();
});

router.get('/home',function(req, res, next){
	var path = req.query.path;
	res.send({
		message: "",
		files: fileManager.readAll(basePath, path)
	});

	
	next();
});


/**
 * 获取某个类型的所有文件或目录
 */
router.get('/category/:type', function(req, res, next) {
	var type = req.params.type;
	res.send({
		message: '',
		files: fileManager.getSameFile(basePath, type)
	});
	next();
})

/**
 * 创建新目录
 */
router.post('/api/create', function(req, res, next) {
	var filename = basePath + '/' + req.body.filename;
	res.send(fileManager.createDir(filename));
	next();
});

/**
 * 重命名文件目录
 */
router.post('/api/rename', function(req, res, next) {
	var body = req.body,
		currentName = basePath + '/' + body.currentName,
		newName = basePath + '/' + body.newName;
	res.send(fileManager.rename(currentName, newName));
	next();
});

/**
 * 删除某个文件或目录
 */
router.post('/api/delete', function(req, res, next) {
	var path = basePath + '/' + req.body.path;
	res.send(fileManager.rmdirSync(path));
	next();
});

module.exports = router;