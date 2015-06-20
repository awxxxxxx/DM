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

/**
 * 如果任务标题为空则显示为'任务标题'
 * @param  {[type]} ) {	return     function(input) {		return input ? input : '任务标题';	}} [description]
 * @return {[type]}   [description]
 */
app.filter('title', function() {
	return function(input) {
		return input ? input : '任务标题';
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
				console.log(value)
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
	
	/** 任务分类 */
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
	/** 所有任务 */
	$scope.allFiles = model.allFiles;
	$scope.pointer = model.pointer;

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


