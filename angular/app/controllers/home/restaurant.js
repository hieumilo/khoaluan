angular.module('App')
.controller('RestaurantController', 
	function($scope, auth, apiService, $cookies, $state, location, $stateParams, FileUploader, $sce) {

		$scope.loading = true;

		$scope.lastpage = 1;
		option = {page : $scope.lastpage};

		$scope.rating2 = 0;
		$scope.isReadonly1 = true;
		$scope.isReadonly2 = true;

		apiService.service('restaurant',$stateParams.id,null,option).getOne()
		.then(function(response) {
			$scope.restaurant = response.restaurant;
			$scope.foods = response.foods;
			$scope.rating1 = response.restaurant.point;
			$scope.mapsrc = $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyDzzmRRMjfC2bI1YriVEfNpbWYl1udfAKo&q=' + $scope.restaurant.place);
			return auth.getProfile();
		})
		.then(function(d) {
	        $scope.username = d.user.name; // thông tin user
	        $scope.user_id = d.user.id; // thông tin user
	        var data = {
	        	user_id: d.user.id,
	        	restaurant_id: $scope.restaurant.id
	        }
	        return apiService.service('evaluation',null,null,data).getList()
	    })
	    .then(function(d) {
	    	if(d.data) {
	    		$scope.rating2 = d.data.point;
	    		$scope.isReadonly2 = false;
	    	}
	    })
		.finally(function() {
			$scope.loading = false;
		});
		

		$scope.rateFunction = function(rating) {
			var data = {
				point: rating,
				restaurant_id: $scope.restaurant.id,
				user_id: $scope.user_id
			};
			apiService.service('evaluation',null,data).post()
			.then(function(d) {
				console.log(d);
				$scope.rating1 = d.point;
				$scope.isReadonly2 = false;
			})
		};

		apiService.service('comment',$stateParams.id).getListByID()
		.then(function(d) {
			$scope.comments = d.data.data;
			$scope.showcmt = $scope.comments.length == 0 ? false : true;
		})

		$scope.uploader = new FileUploader();

		$scope.send = function($stateParams) {
			var formData = new FormData();

			formData.append('restaurant_id', $scope.restaurant.id);
			formData.append('user_id', $scope.user_id);

			angular.forEach($stateParams.comment, function(value, key){
				formData.append(key, value);
			});

			angular.forEach($scope.uploader.queue, function(value, key) {
				formData.append('files[]', value._file)
			});

			apiService.service('comment',null,formData).postWithFile()
			.then(function(d){
				$scope.comments = d.data.data;
				$scope.uploader.queue = []
			})
		}

	// load more
	$scope.loadMore = function() {
		$scope.lastpage += 1;

		option = {page : $scope.lastpage};
		apiService.service('comment',$stateParams.id,null,option).getListByID()
		.then(function(d) {
			$scope.comments = $scope.comments.concat(d.data.data);
		})
	};

});