angular.module('App')
.controller('UserRestaurantFoodsController', function($scope, auth, apiService, $stateParams) {

	var restaurant_id = $stateParams.id;
	console.log(restaurant_id);

	apiService.service('user/restaurant',restaurant_id).getListByID()
	.then(function(d){
		$scope.restaurant = d.data;
	})

	apiService.service('user/restaurant/foods',restaurant_id).getListByID()
	.then(function(d){
		$scope.foods = d.data;
	})

	$scope.remove = function(food, index) {
		if(confirm('delete ??')){ // nếu muốn xóa
			var food = apiService.service('user/restaurant/food',food.id);
			food.remove()
			.then(function(d) {
				alert(d.message)
				var foods = [];
	            angular.forEach($scope.foods, function(file, key){
	                if(index != key){
	                    foods.push(file);
	                }
	            });
	            $scope.foods = foods;
			})
		}
	}


});