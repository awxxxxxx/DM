/**
 * 封装关于文件目录的操作
 * 
 */
var fs = require('fs'),
	path = require('path'),
	filePath, travelDir,
	readAll, createDir,
	rename, rmdirSync,
	uploadFile;

/**
 * 将文件路径转换为完整路径
 * @param  {[type]} dir   [description]
 * @param  {[type]} files [description]
 * @return {[type]}       [description]
 */
filePath = function(dir, files) {
	return files.map(function(f) {
		return path.join(dir, f)
	})
};

/**
 * 深度遍历某个目录下的所有文件和目录
 * @param  {[type]}   dir      [遍历起始目录]
 * @param  {Function} callback [文件回调处理函数]
 */
travelDir = function(dir, callback) {
	fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
		
		// 遍历子目录
        if (fs.statSync(pathname).isDirectory()) {
            travelDir(pathname, callback);
        }
        else {
            callback(pathname);
        }
    });
};

/**
 * 列出某个目录下的所有目录和文件（只遍历一层）
 * @param 
 */
readAll = function(dir) {
	var currentFiles = fs.readdirSync(dir),
		files = [];
	currentFiles.forEach(function (file) {
		var currentPath = dir + '/' + file;
		fileStats = file.statSync(currentPath);
		files.push({
			isdir: fileStats.isDirectory(),
			path: currentPath,
			filename: file,
			mtime: fileStats.mtime,
			ctime: fileStats.ctime,
			size: fileStats.size
		});
	});
	return files;
}

/**
 * 创建新目录
 */
createDir = function (dirname, mode, callback) {
		var message, status;
		mode = mode || 0755;
		if(path.existsSync(dirname)) {
			message = "文件夹已存在";
			status = 0;
		}
		else {
			fs.mkdirSync(dirname, mode);
			message = "文件夹创建成功";
			status = １;
		}
		return {
			message: message,
			status:status
		};
};

/**
 * 重命名文件
 */
rename = function (currentName, newName) {
		var message, status;
		fs.rename(currentName, newName, function(e) {
			if(e) {
				message = "重命名失败";
				status = 0;
			}
			else {
				message = "重命名成功";
				status = 1;
			}
		});
		return {
			message: message,
			status: status
		};
};

/**
 * 递归删除目录以及目录下的文件
 */
rmdirSync = (function () {
	
	 function iterator(url, dirs){
         var stat = fs.statSync(url);
         if(stat.isDirectory()){
             dirs.unshift(url);
             inner(url,dirs);
         }
		 else 
		 if(stat.isFile()) {
			  //删除文件
            　fs.unlinkSync(url);
         }
     }
	 
     function inner(url,　dirs){
         var arr = fs.readdirSync(path);
         for(var i = 0, el ; el = arr[i++];) {
             iterator(url + "/" + el, dirs);
         }
     }
	 
     return function(dir) {
		 var message, status;
         var dirs = [];
 
         try {
             iterator(dir,dirs);
             for(var i = 0, el ; el = dirs[i++];) {
				 //删除所有存在的目录
                 fs.rmdirSync(el);
             }
			 message = "文件删除成功";
			 status = 0;
         }
		 catch (e) {
			 //如果文件或目录本来就不存在
			 message = "文件删除失败";
			 status = 1;
         }
		 return {
			 message: message,
			 status: status
		 }
     }
})();


uploadFile = function (tmppath, currentPath,filename) {
	
     var target_path = currentPath + '/' + filename;
     // 移动文件
     fs.rename(tmp_path, target_path, function(err) {
         if (err) throw err;
         // 删除临时文件夹文件, 
         fs.unlink(tmp_path, function() {
             if (err) throw err;
             res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
         });
     });
};
