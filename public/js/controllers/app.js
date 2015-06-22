/**
 * 主控制器
 * @author waterbear
 * @type {[type]}
 */
var app = angular.module('DM', ['ngMaterial', 'DM.services', 'DM.utils']);
app.config(['$mdThemingProvider', function($mdThemingProvider) {
	$mdThemingProvider
		.theme('default')
		.accentPalette('amber', {
      		default: '700'
    	});
}]);

app.config(['$httpProvider',function($httpProvider){
	$httpProvider.defaults.headers.common['basepath'] = '/media/waterbear/code';
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
app.controller('DMCtrl', function($scope, $animate, model, toast, dialog){
	$scope.categories = model.getCategories();

	var currentDir = '';

	$scope.cateItem = 0;
	$scope.cateChange = function(index) {
		$scope.cateItem = index;
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

	$scope.user = {
		selectAllBox: false,
		delIndex: null
	}	
	/** 初始化获取所有文件 */
	$scope.allFiles = [];
	model.getFiles('/home').then(function(succ) {
		angular.copy(succ.data.files, $scope.allFiles);
		model.files = $scope.allFiles;
	}, function(error) {
		console.log(error);
	});

	/** 加载某个文件里面的内容 */
	$scope.nextDir = function(path, filename, type, flag) {
		if(type) {
			return;
		}
		
		model.getFiles('/home?path=' + path).then(function(succ) {
			angular.copy(succ.data.files, $scope.allFiles);

			//目录变换，增加一层目录
			currentDir = path;

			//　加载成功将当前路径加入文件层次栈
			if(filename !== '全部文件' && flag) {
				$scope.fileStack.push(filename);
			}
		}, function(error) {
			console.log(error);
		});
	}


	/** 显示新增文件编辑框 */
	$scope.newFileEdit = false;

	/** 监听任务分类是否改变 */
	$scope.$on('cateChange', function(evt, newIndex) {
		console.log(newIndex);
	})

    /** 增加新文件 */
    $scope.addNewFile = function() {

    	if(!$scope.user.filename) {
    		return;
    	}
    	var newFileName = $scope.user.filename,

    		//加上当前所在文件夹的路径
    		path = currentDir + '/' + newFileName,
    		newFile = {
    			filename: newFileName,
    			path: path,
    			selected: false,
    			size: 0,
    			mtime: new Date(),
    			type: 0
    		};

    	// 发送新建文件夹数据到后台
    	model.sendPost('/api/create', {filename: path})
    	.then(function(succ) {
    		
    		// 增加文件成功往本地文件数组中添加新建文件信息
    		if(succ.data.status) {
    			$scope.allFiles.unshift(newFile);
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

    var delIndex
    /** 显示删除弹框 */
	$scope.showCustomToast = function($event, index) {
		delIndex = index;
		var message = {
				title: '确认删除该文件?',
				content: '文件夹下所有的文件将会被删除'
			};

		//　点击弹框中的确认按钮后，删除文件
		function confirmDel() {
			var path = $scope.allFiles[delIndex].path;
			model.sendPost('/api/delete', {path: path})
				.then(function (succ) {
					if(succ.data.status) {
						$scope.allFiles.splice(delIndex, 1);
					}
					toast.showInform(succ.data.message);
				}, function(error) {
					console.log(succ.data);
			});
		}
		
		//　调用确认弹框
		dialog.showConfirm($event, message, confirmDel);
	}

});
