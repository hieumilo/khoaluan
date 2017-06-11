angular.module('App')
.controller('ProfileController', function($scope, auth, apiService, $stateParams) {

	// gọi service auth
	// lấy thông tin user hiện đang đăng nhập vào hệ thống
    auth.getProfile()
    .then(function(d){
        $scope.profile = d.user; // thông tin user
        return apiService.service('user/restaurant',null,null,{user_id: d.user.id}).getList()
    })
    .then(function(d){
    	$scope.restaurants = d.data;
        $scope.count = d.data.length;
    })

    $scope.tab = 1;

    $scope.setTab = function(newTab){
    	$scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
    	return $scope.tab === tabNum;
    };

    $scope.changPassword = function($stateParams) {
        
        apiService.service('auth/me/change-pass',null,$stateParams.user).post()
        .then(function(d) {
            alert(d.message)
        })
        .catch(function(er) {
            if($scope.haserpass = !!er.er) {
                $scope.erpass = er.er;
            } else {
                $scope.erpass = null;
            }
            if($scope.haserpass = !!er.error.password) {
                $scope.erpass = er.error.password[0];
            } else {
                $scope.erpass = null;
            }
            if($scope.hasernewpass = !!er.error.newpass) {
                $scope.ernewpass = er.error.newpass[0];
            } else {
                $scope.ernewpass = null;
            }
            if($scope.haserrenewpass = !!er.error.renewpass) {
                $scope.errenewpass = er.error.renewpass[0];
            } else {
                $scope.errenewpass = null;
            }
        })
    }

});
