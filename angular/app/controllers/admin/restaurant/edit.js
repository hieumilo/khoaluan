angular.module('App')
.controller('EditRestaurantCtrl', 
	function($scope, API, $stateParams, apiService, cfpLoadingBar, $stateParams, toastr) {

		cfpLoadingBar.start();
		// lấy id restaurant hiện tại đang sửa
		var id = $stateParams.id;
		$scope.hasData = true;
		// lấy thông tin restaurant hiện tại
		var restaurant = apiService.serviceAdmin('restaurant',id);
		restaurant.getOne()
			.then((d) => {
				console.log(d)
				if(d.data != null) { // nếu có dữ liệu của id restaurant hiện đang sửa
					$scope.hasData = true;
					$scope.restaurant = d.data; // hiển thị thông tin restaurant
					if(d.data.status == 1) { // nếu restaurant đã bị khóa
						$scope.isLock = true;
					}
				} else { // nếu không tìn thấy dữ liệu
					$scope.hasData = false;
				}
				
			})
			.finally(function(){
				cfpLoadingBar.complete();
			})
		// update restaurant
		$scope.save = function(){
			cfpLoadingBar.start();
			// gọi service apiService
			// gửi thông tin restaurant lên server
			var restaurant = apiService.serviceAdmin('restaurant',id,null);
			restaurant.put()
				.then(function(response){ // nếu update thành công
					$scope.restaurant = response.restaurant; // thông tin restaurant sau khi update
					toastr.success(response.message, {timeOut: 3000}); // hiển thị thông báo
				})
				.catch(function(error){ // nếu có lỗi xảy ra
					toastr.error("Đã có lỗi xảy ra", {timeOut: 3000}); // hiển thị thông báo lỗi
				})
				.finally(function() {
			        cfpLoadingBar.complete();
			    });
		}
	});