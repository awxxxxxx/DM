/**
 * 弹窗模块
 * 
 */

angular.module('DM.utils', ['ngMaterial'])
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
		function showInform(content) {
			$mdToast.show(
      			$mdToast.simple()
        			.content(content)
        			.position(getToastPosition())
        			.hideDelay(3000)
    	)};
		return {
			getToastPosition:getToastPosition,
			showCustomToast: showCustomToast,
			closeToast: closeToast,
			showInform: showInform,
			cancel: cancel
		}
}]).factory('dialog', ['$mdDialog', function($mdDialog, $mdToast, $animate){
	function showDialog() {
		$mdDialog.show(
      	$mdDialog.alert()
        	.parent(angular.element(document.body))
        	.content('You can specify some description text in here.')
        	.ariaLabel('通知弹窗')
        	.ok('知道了')
        	.targetEvent(ev)
    	);
	}
	function showConfirm(ev, message, confirmFn, cancelFn) {
		var confirm = $mdDialog.confirm()
      				.parent(angular.element(document.body))
      				.title(message.title)
      				.content(message.content)
      				.ariaLabel('Lucky day')
      				.ok('确定')
      				.cancel('取消')
      				.targetEvent(ev);
		$mdDialog.show(confirm).then(function() {
		    confirmFn();
		}, function() {
			cancelFn = cancelFn || function() {};
			cancelFn();
		});
	}
	return {
		showDialog: showDialog,
		showConfirm: showConfirm
	}
}])