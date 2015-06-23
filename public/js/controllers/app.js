/**
 * 主控制器
 * @author waterbear
 * @type {[type]}
 */
var app = angular.module('DM', ['ngMaterial', 'DM.services', 'DM.utils','ngFileUpload']);
app.config(['$mdThemingProvider', function($mdThemingProvider) {
	$mdThemingProvider
		.theme('default')
		.accentPalette('amber', {
      		default: '700'
    	});
}]);

/**
 * 指定不同文件类型的图标
 * @param  {Array}  ) {	var        icon [description]
 * @return {[type]}   [description]
 */
app.filter('showGlyphicon', function() {
	var icon = [
		'glyphicon-folder-close',
		'glyphicon-picture',
		'glyphicon-file',
		'glyphicon-film',
		'glyphicon-music',
		'glyphicon-list-alt'
	];
	return function(input) {
		return icon[input];
	}
});



/**
 * 自动获取焦点
 * @param  {[type]} $timeout) 
 * @return {[type]}           [description]
 */
app.directive('focusMe', function($timeout) {
	return {
		scope: {trigger: '=focusMe'},
		link: function(scope, element) {
			scope.$watch('trigger', function(value) {
				if(value === true) {
					element[0].focus();
					scope.trigger = false;
				}
			});
		}
	}
})


/**
 * 主控制器
 * @param  {[type]} $scope [description]
 * @return {[type]}        [description]
 */
app.controller('DMCtrl', function($scope, $timeout, $animate, model, toast, dialog, Upload){
	$scope.categories = model.getCategories();

	//指示当前相对目录
	var currentDir = '';

	$scope.cateItem = 0;
	$scope.user = {
		selectAllBox: false,
		basepath: '根目录未设置'
	}

	/** 初始化获取所有文件 */
	$scope.allFiles = [];

	var base = sessionStorage.getItem('basepath');
	if(base) {
		$scope.user.basepath = base;

		// 初始化文件列表
		refreshFiles($scope.allFiles);
	}
	else {
		toast.showInform('请设置根目录');
		$scope.showEditPath = true;
	}

	$scope.cateChange = function(index) {
		$scope.cateItem = index;
	}

	//确认更改当前根目录
	$scope.changeBasePath = function() {
		var tmp = $scope.newBasePath;
		if(tmp) {

			//将更改后的根路径存入本地
			sessionStorage.setItem('basepath', tmp);
			$scope.user.basepath = tmp;
			// 更新文件数组
			refreshFiles($scope.allFiles);
			$scope.showEditPath = false;
		}

	}

	// 文件层次数组，记录点击文件的层次
	$scope.fileStack = ['全部文件'];

	/** 点击导航栏改变当前目录 */
	$scope.changeDir = function(index) {
		var len = $scope.fileStack.length,
			path = '';
		// 当当前文件层次为 1 初始化目录时，不操作
		if(len === 1) {
			return;
		}

		for(var i = 1; i < index + 1; i++) {
			path += '/' + $scope.fileStack[i];
		}
		$scope.fileStack.splice(index+1, len - index);
		//　加载目录下的文件
		$scope.nextDir(path, $scope.fileStack[i], 0);
	}

	//刷新当前的文件列表
	function refreshFiles(files, path, callback) {
		path = path || '';
		callback = callback || function() {};
		model.getFiles('/home?path='+ path).then(function(succ) {
			angular.copy(succ.data.files, files);
			callback();
		}, function(error) {
			toast.showInform('文件目录错误');
		});
	}


	/** 加载某个文件里面的内容 */
	$scope.nextDir = function(path, filename, type, flag) {
		if(type) {
			return;
		}
		refreshFiles($scope.allFiles, path, function() {

			//目录变换，增加一层目录
			currentDir = path;

			//　加载成功将当前路径加入文件层次栈
			if(filename !== '全部文件' && flag) {
				$scope.fileStack.push(filename);
			}
		});
		// model.getFiles('/home?path=' + path).then(function(succ) {
		// 	angular.copy(succ.data.files, $scope.allFiles);

		// }, function(error) {
		// 	console.log(error);
		// });
	}


	/** 显示新增文件编辑框 */
	$scope.newFileEdit = false;

	// 将新文件压入本地文件数组
	function pushFile(newFileName, type) {
		//加上当前所在文件夹的路径
    	var path = currentDir + '/' + newFileName;
    	type = type || 0;
    	newFile = {
    		filename: newFileName,
    		path: path,
    		selected: false,
    		size: 0,
    		mtime: new Date(),
    		type: type
    	};
    	$scope.allFiles.unshift(newFile);
	} 

    /** 增加新文件 */
    $scope.addNewFile = function() {

    	if(!$scope.user.filename) {
    		return;
    	}
    	var newFileName = $scope.user.filename,
    		path = currentDir + '/' + newFileName;

    	// 发送新建文件夹数据到后台
    	model.sendPost('/api/create', {filename: path})
    	.then(function(succ) {
    		
    		// 增加文件成功往本地文件数组中添加新建文件信息
    		if(succ.data.status) {
    			pushFile(newFileName);
    		}
    		else {
    			return;
    		}

    		//　显示操作结果
    		toast.showInform(succ.data.message);
    		$scope.user.filename = '';
    		$scope.newFileEdit = false;

    	}, function(error) {

    	});
    }

    /** 点击全选框后，改变所有选择框状态 */
    $scope.changeSelect = function() {
    	var len = $scope.allFiles.length;
    	for(var i = 0; i < len; i++) {
    		$scope.allFiles[i].selected = !$scope.user.selectAllBox;
    	}
    };

    /** 记录当前文件的名称 */
    var currentName;

    /** 被点击文件的下标 */
    $scope.renameIndex = null;

    /** 显示编辑框 */
   　$scope.showRenameInput = function(index) {
   		$scope.renameIndex = index;
   		currentName = $scope.allFiles[index].filename;
   	}
    
    /** 文件确认重命名 */
    $scope.fileRename = function() {
    	var data = {
    		currentName: $scope.allFiles[$scope.renameIndex].path,
    		newName: currentDir + '/' + $scope.allFiles[$scope.renameIndex].filename
    	};

    	//发送重命名数据到后端
    	model.sendPost('/api/rename', data).then(function(succ) {
    		
    		// 重命名失败，取消重命名
    		if(!succ.data.status) {
    			$scope.cancelRename();
    		}

    		toast.showInform(succ.data.message);
    		$scope.renameIndex = null;

    	}, function(error) {

    	});
    	
    }

    /** 取消文件重命名 */
    $scope.cancelRename = function() {

    	// 将文件名恢复到之前的名字
    	$scope.allFiles[$scope.renameIndex].filename = currentName;
    	$scope.renameIndex = null;
    }

    /** 显示删除弹框 */
	$scope.showCustomToast = function($event, index) {
		var message = {
				title: '确认删除该文件?',
				content: '文件夹下所有的文件将会被删除'
			};

		//　点击弹框中的确认按钮后，删除文件
		function confirmDel() {
			var path = $scope.allFiles[index].path;
			model.sendPost('/api/delete', {path: path})
				.then(function (succ) {
					if(succ.data.status) {
						$scope.allFiles.splice(index, 1);
					}
					toast.showInform(succ.data.message);
				}, function(error) {
					console.log(error);
			});
		}
		
		//　调用确认弹框，确认是否删除
		dialog.showConfirm($event, message, confirmDel);
	}

	/**
	 * 上传文件
	 * @return {[type]} [description]
	 */
	$scope.upload = function(files) {
		if(files && files.length) {
			var path = '/media/waterbear/code/' + currentDir;
			for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/api/upload',
                    fields: {
                    	path: path,
                    	basepath: sessionStorage.getItem('basepath')
                    },
                    file: file
                }).progress(function (evt) {

                	// Todo
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                	
                	if(data.status) {
                		//检测文件类型
                		var type = dialog.getType(config.file.name);

                		//文件上传成功，更新当前文件列表
                		pushFile(config.file.name, type);
                	}
                	toast.showInform(data.message);
                });
            }
        }
    };


});
