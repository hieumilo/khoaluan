angular.module('App')
.controller('ProfileCtrl', function($scope, $rootScope, auth) {
	// gọi service auth
	// lấy thông tin của user hiện tại đang đăng nhập vào hệ thống
	auth.getProfile()
    .then(function(d){
        $scope.profile = d.user; // thông tin user
    })
	
});