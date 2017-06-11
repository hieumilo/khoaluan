angular.module('App')
.controller('CategoryController', function($scope, auth, apiService, $cookies, $state, location, $stateParams) {

	// khởi tạo quận/huyện khi chưa chọn
	$scope.currentDistrict = '- Quận/Huyện -';
	// khởi tạo phường/xã khi chưa chọn
	$scope.currentWard = '- Phường/Xã -';
	// lấy danh sách quận/huyện theo id tỉnh/thành lưu trong cookie
	// gọi service location
	location.getDistrictsByProvinceid($cookies.get('loc'))
	.then(function(d){
		// trả về danh sách quận/huyện
		$scope.districts = d.data;
	})

	var option = {
		category: $stateParams.id,
		provinceid: $cookies.get('loc')
	};

	apiService.service('restaurant',null,null,option).getList()
	.then(function(d) {
		if(d.data.data.length == 0) {
			$scope.hasData = false;
		} else {
			$scope.hasData = true;
			$scope.res = d.data.data
		}
	})

	$scope.showWard = false;
	// thay đổi quận/huyện
	$scope.changeDistrict = function(districtid) {
		// gọi service apiService
		apiService.service('district',districtid).getOne()
		.then(function(d){
			// hiển thị tên quận huyện vừa chọn
			$scope.currentDistrict = d.data.name;

			$scope.showWard = true;
			// tiếp tục lấy danh sách phường/xã theo quận huyện vừa thay đổi
			return location.getWardsByDistrictid(d.data.districtid);
		})
		.then(function(d){
			// trả về danh sách phường/xã
			$scope.wards = d.data;
			option = {
				category: $stateParams.id,
				districtid: districtid
			}
			return apiService.service('restaurant',null,null,option).getList()
		})
		.then(function(d){
			if(d.data.data.length == 0) {
				$scope.hasData = false;
			} else {
				$scope.hasData = true;
				$scope.res = d.data.data
			}
		})
	}
	// thay đổi phường/xã
	$scope.changeWard = function(wardid) {
		// gọi service apiService
		apiService.service('ward',wardid).getOne()
		.then(function(d){
			// hiển thị tên phường xã vừa chọn
			$scope.currentWard = d.data.name;
			// lấy danh sách các địa điểm theo phường/xã
			option = {
				category: $stateParams.id,
				wardid: wardid
			}
			return apiService.service('restaurant',null,null,option).getList()
		})
		.then(function(d){
			if(d.data.data.length == 0) {
				$scope.hasData = false;
			} else {
				$scope.hasData = true;
				$scope.res = d.data.data
			}
		})
	}
	// lấy danh sách danh mục
	// gọi service apiService
	apiService.service('category').getList()
	.then(function(d){
		// trả về danh sách danh mục
		$scope.categories = d.data;
	})

	$scope.lastpage = 1;

	// load more
	$scope.loadMore = function() {
        $scope.lastpage += 1;

        option.page = $scope.lastpage;
        apiService.service('restaurant',null,null,option).getList()
        .then(function(d) {
			$scope.res = $scope.res.concat(d.data.data);
        })
    };

});