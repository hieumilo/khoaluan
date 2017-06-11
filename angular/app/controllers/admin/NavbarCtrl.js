angular.module('App')
.controller('NavbarCtrl', function($scope, $rootScope, auth) {
	// // thay đổi class body
	// $rootScope.bodyClass = false;
	// $scope.changeBodyClass = function(){
	// 	$scope.flag = !$rootScope.bodyClass;
	// 	$rootScope.bodyClass = $scope.flag;
	// }

	// hiển thị tên người dùng hiện tại đang đăng nhập vào hệ thống
	$scope.username = auth.getCurrentUser().name;

});