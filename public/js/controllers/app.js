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
app.controller('DMCtrl', function($scope, $animate, model, toast){
	$scope.categories = model.getCategories();
	/** 切换分类 */
	$scope.cateItem = 0;
	$scope.cateChange = function(index) {
		$scope.cateItem = index;
		$scope.$broadcast('cateChange', index);
	}

	$scope.$on('changeFile', function(evt, newIndex) {
		$scope.$broadcast('FileIndexChange', newIndex);

	});

});

app.controller('allFilesCtrl', function($scope, model, toast) {
	//当前文件目录
	var currentDir = '';
	$scope.user = {
		selectAllBox: false
	}	
	/** 初始化获取所有文件 */
	$scope.allFiles = [];
	model.getFiles('/home').then(function(succ) {
		angular.copy(succ.data.files, $scope.allFiles);
	}, function(error) {
		console.log(error);
	});

	/** 加载某个文件里面的内容 */
	$scope.nextDir = function(path, type) {
		if(type) {
			return;
		}
		currentDir += path;
		model.getFiles('/home?path=' + path).then(function(succ) {
			angular.copy(succ.data.files, $scope.allFiles);
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
	var delIndex;
	$scope.showCustomToast = function(index) {
		delIndex = index;
		toast.showCustomToast('allFilesCtrl');
	}

	$scope.confirmDel = function() {
		$scope.allFiles.splice(delIndex, 1);
		console.log(model.allFiles);
		toast.closeToast();
	}

	$scope.cancelDel = function() {
		toast.closeToast();
	}

});


