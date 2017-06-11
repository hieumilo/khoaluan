angular.module('App')
.controller('EditUserCtrl', 
	function($scope, API, $stateParams, apiService, cfpLoadingBar, $stateParams, toastr) {

		cfpLoadingBar.start();
		// lấy id user hiện tại đang sửa
		var id = $stateParams.id;
		$scope.hasData = true;
		// lấy thông tin user hiện tại
		var user = apiService.serviceAdmin('user',id);
		user.getOne()
			.then((d) => {
				if(d.data != null) { // nếu có dữ liệu của id user hiện đang sửa
					$scope.hasData = true;
					$scope.user = d.data; // hiển thị thông tin user
					if(d.data.status == 1) { // nếu user đã bị khóa
						$scope.isLock = true;
					}
				} else { // nếu không tìn thấy dữ liệu
					$scope.hasData = false;
				}
				
			})
			.finally(function(){
				cfpLoadingBar.complete();
			})
		// update user
		$scope.save = function($stateParams){
			cfpLoadingBar.start();
			// gọi service apiService
			// gửi thông tin user lên server
			var user = apiService.serviceAdmin('user',id,$stateParams.data);
			user.put()
				.then(function(response){ // nếu update thành công
					$scope.user = response.user; // thông tin user sau khi update
					$scope.isLock = response.lock; // kiểm tra user có bị khóa hay không?
					toastr.success(response.message, {timeOut: 3000}); // hiển thị thông báo
				})
				.catch(function(error){ // nếu có lỗi xảy ra
					toastr.error(error.error, {timeOut: 3000}); // hiển thị thông báo lỗi
				})
				.finally(function() {
			        cfpLoadingBar.complete();
			    });
		}
	});