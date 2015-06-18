/**
 * 弹窗模块
 * 
 */

angular.module('easyToDo.utils', ['ngMaterial'])
	.factory('toast', ['$mdToast',function($mdToast){
		var toastPosition = {
		    bottom: false,
		    top: true,
		    left: true,
		    right: false
		};

		function getToastPosition() {
			return Object.keys(toastPosition)
			    .filter(function(pos) { return toastPosition[pos]; })
			    .join(' ');
		};

		function showCustomToast(controller) {
		    $mdToast.show({
		      controller: controller,
		      templateUrl: '/public/template/toast-attention.html',
		      hideDelay: 6000,
		      position: getToastPosition()
		    });
		};

		function closeToast() {
			$mdToast.hide();
		};

		function cancel() {
			$mdToast.hide();
		};

		return {
			getToastPosition:getToastPosition,
			showCustomToast: showCustomToast,
			closeToast: closeToast,
			cancel: cancel
		}
}]);