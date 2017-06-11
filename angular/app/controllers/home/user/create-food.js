angular.module('App')
.controller('UserCreateFoodController', function($scope, auth, apiService, $stateParams, $http, FileUploader) {

	var restaurant_id = $stateParams.id;

	apiService.service('user/restaurant',restaurant_id).getListByID()
	.then(function(d){
		$scope.restaurant = d.data;
	})
	
	apiService.service('user/restaurant/foods',restaurant_id).getListByID()
	.then(function(d){
		$scope.foods = d.data;
	})

	apiService.service('user/restaurant/foods',restaurant_id).getListByID()
	.then(function(d){
		$scope.foods = d.data;
	})

 	var uploader = $scope.uploader = new FileUploader();

 	uploader.onAfterAddingFile = function(fileItem) {
        uploader.queue = [fileItem];
    };

	$scope.save = function($stateParams) {

        var formData = new FormData();

        angular.forEach($stateParams.food, function(value, key){
            formData.append(key, value);
        });

        angular.forEach($scope.uploader.queue, function(value, key) {
            formData.append('files[]', value._file)
        });

        apiService.service('user/restaurant/food',restaurant_id,formData).postWithFile()
        .then(function(d){
        	alert(d.message)
        })
        .catch(function(er) {
        	if($scope.hasername = !!er.error.name){
				$scope.ername = er.error.name[0];
			} else {
				$scope.ername = null;
			}
        	if($scope.haserprice = !!er.error.price){
				$scope.erprice = er.error.price[0];
			} else {
				$scope.erprice = null;
			}
        	if($scope.haserdescription = !!er.error.description){
				$scope.erdescription = er.error.description[0];
			} else {
				$scope.erdescription = null;
			}
        })
	}

});