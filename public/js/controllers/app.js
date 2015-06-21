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
 * @param  {[type]} $timeout) {	return       {		scope: {trigger:                   '               [description]
 * @param  {[type]} link:     function(scope, element)   {			scope.$watch('trigger', function(value) {				if(value [description]
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
	/** 获取所有文件 */
	$scope.allFiles = [];
	$scope.user = {
		selectAllBox: false
	}	
	model.getFiles().then(function(succ) {
		angular.copy(succ.files, $scope.allFiles);
	}, function(error) {
		console.log(error);
	});

	/** 显示任务编辑框 */
	$scope.newFileEdit = false;

	/** 监听任务分类是否改变 */
	$scope.$on('cateChange', function(evt, newIndex) {
		console.log(newIndex);
	})

	$scope.FileChange = function(index) {
    	$scope.FileIndex = index;
    	$scope.$emit('changeFile',index);
    }
    /** 增加新文件 */
    $scope.addNewFile = function() {
    	if(!$scope.user.filename) {
    		return;
    	}
    	var File = {
    		filename: $scope.user.filename,
    		selected: false,
    		size: '-',
    		date: new Date()
    	};
    	$scope.allFiles.unshift(File);
    	$scope.newFileEdit = false;
    	$scope.user.filename = '';
    	$scope.FileChange(0);
    }

    $scope.changeSelect = function() {
    	var len = $scope.allFiles.length;
    	for(var i = 0; i < len; i++) {
    		$scope.allFiles[i].selected = !$scope.user.selectAllBox;
    	}
    	console.log($scope.selectAll);
    	console.log($scope.allFiles);
    };

    $scope.renameIndex = null;
    /** 文件重命名 */
    $scope.fileRename = function() {
    	$scope.renameIndex = null;
    	console.log($scope.renameIndex);
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


