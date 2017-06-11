angular.module('App')
.controller('HeaderController', 
	function($scope, auth, apiService, $cookies, $state, $stateParams, $location) {
	// kiểm tra đăng nhập
	// gọi service auth
	auth.isAuthenticated().then(function() {
		// đã có đăng nhập
		$scope.isAuthenticated = true;
		// lấy tên người dùng hiện tại
		$scope.username = auth.getCurrentUser().name;
		// kiểm tra quyền admin
		if(auth.getCurrentUser().level == 0) {
			// đúng là admin
			$scope.isAdmin = true;
		}
		return apiService.service('auth/me/notification').getList();
	})
	.then(function(d) {
		$scope.count = d.count;
		$scope.notifications = d.notifications;
	});

	$scope.seen = function($stateParams) {
		console.log($stateParams.id);
		apiService.service('auth/me/change-noti', $stateParams.id).getOne()
		.then(function(d) {
			console.log(d);
			$scope.count = d.count;
			$state.go('home.user-restaurant-foods', {id: d.restaurant_id});
		})
	}

	// lấy danh sách tỉnh/thành
	// gọi service apiService
	var province = apiService.service('provinces');
	province.getList().then(function(d){
		// trả về danh sách tỉnh/thành
		$scope.provinces = d.data;
	})

	// khởi tạo tỉnh thành
	// nếu đã chọn tỉnh thành
	if($cookies.get('loc') != null) {
		// gọi service apiService
		apiService.service('province',$cookies.get('loc')).getOne()
		.then(function(d){
			// lấy tên tỉnh thành đã được chọn
			$scope.location = d.data.name;
		})
	} else {
		// nếu chưa chọn tỉnh thành
		$cookies.put('loc',48); // khởi tạo tỉnh thành mặc định là Đà Nẵng với mã là 48
		// gọi service apiService
		apiService.service('province','48').getOne()
		.then(function(d){
			$scope.location = d.data.name;
		})
	}
	// thay đổi tỉnh thành
	$scope.changeProvince = function(provinceid) {
		$cookies.put('loc',provinceid); // lưu id tỉnh/thành vừa thay đổi vào cookie
		$state.reload();
	}

	$scope.searchText = $location.search().search;

	// tìm kiếm
	$scope.search = function(){
		if($scope.searchText != null) {
			$state.go('home.search', {search: $scope.searchText});
			// còn code tiếp
		}
	}
});