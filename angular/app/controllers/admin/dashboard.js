angular.module('App')
.controller('DashboardController', function($scope, $rootScope, auth, apiService) {

	apiService.serviceAdmin('dashboard').getList()
	.then(function(d) {
		console.log(d);
		$scope.user = d.user;
		$scope.suggesstion = d.suggesstion;
		$scope.restaurant = d.restaurant;
		$scope.restaurant1 = d.restaurant1;
	})
	
});