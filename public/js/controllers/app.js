/**
 * 主控制器
 * @author waterbear
 * @type {[type]}
 */
var app = angular.module('easyToDo', ['ngMaterial', 'easyToDo.services', 'easyToDo.utils']);
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
app.controller('easyToDoCtrl', function($scope, $animate, model, toast){
	
	/** 任务分类 */
	$scope.categories = model.getCategories();

	/** 切换分类 */
	$scope.cateChange = function(index) {
		$scope.cateItem = index;
		$scope.$broadcast('cateChange', index);
	}

	/** 显示分类编辑框 */
	$scope.cateEditShow = false;
	$scope.user = {
		newCate: ''
	};

	/** 增加分类 */
	$scope.addNewCate = function() {
		console.log($scope.user.newCate);
		$scope.categories.push({content: $scope.user.newCate});
		$scope.cateEditShow = false;
		$scope.user.newCate = '';
	}

	/** 取消编辑 */
	$scope.cancelAdd = function() {
		$scope.cateEditShow = false;
		$scope.user.newCate = '';
	}


	$scope.$on('changeTask', function(evt, newIndex) {
		$scope.$broadcast('taskIndexChange', newIndex);

	});

	/** 编辑分类 */
	var content;
	$scope.editIndex = null;
	$scope.editCate = function(index, $event) {
		$scope.editIndex = index;
		content = $scope.categories[index].content;
		$event.preventDefault();
		$event.stopPropagation();
	};

	$scope.cancelEdit = function() {
		$scope.categories[$scope.editIndex].content = content;
		$scope.editIndex = null;

	};

	$scope.confirmEdit = function() {
		$scope.editIndex = null;
	}

	/** 显示分类弹框 */
	var delIndex;
	$scope.showCustomToast = function(index) {
		delIndex = index;
		toast.showCustomToast('easyToDoCtrl');
	}

	$scope.confirmDel = function() {
		$scope.categories.splice(delIndex, 1);
		toast.closeToast();
	}

	$scope.cancelDel = function() {
		toast.closeToast();
	}

});

app.controller('allTasksCtrl', function($scope, model, toast) {
	/** 所有任务 */
	$scope.allTasks = model.allTasks;
	$scope.pointer = model.pointer;

	/** 显示任务编辑框 */
	$scope.newTaskEdit = false;

	/** 监听任务分类是否改变 */
	$scope.$on('cateChange', function(evt, newIndex) {
		console.log(newIndex);
	})

	$scope.taskChange = function(index) {
    	$scope.taskIndex = index;
    	$scope.$emit('changeTask',index);
    }

    /** 增加新任务 */
    $scope.addNewTask = function() {
    	if(!$scope.user.title) {
    		return;
    	}
    	var task = {
    		title: $scope.user.title,
    		selected: false
    	};
    	$scope.allTasks.unshift(task);
    	$scope.newTaskEdit = false;
    	$scope.user.title = '';
    	$scope.taskChange(0);
    }

    /** 显示删除弹框 */
	var delIndex;
	$scope.showCustomToast = function(index) {
		delIndex = index;
		toast.showCustomToast('allTasksCtrl');
	}

	$scope.confirmDel = function() {
		$scope.allTasks.splice(delIndex, 1);
		console.log(model.allTasks);
		toast.closeToast();
	}

	$scope.cancelDel = function() {
		toast.closeToast();
	}

});


