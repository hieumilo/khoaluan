angular.module('App')
.controller('CreateCategoryCtrl', 
	function($scope, API, $stateParams, apiService, cfpLoadingBar, $stateParams, toastr) {

		cfpLoadingBar.start();

		cfpLoadingBar.complete();
		// gửi thông tin tạo mới danh mục lên server
		$scope.save = function($stateParams){
			cfpLoadingBar.start();
			// gọi service apiService
			// gửi dữ liệu vừa nhập lên server
			var category = apiService.serviceAdmin('category',null,$stateParams.data);
			category.post()
			.then(function(response){
				// tạo mới thành công
				// hiển thị thông báo
				toastr.success(response.message, {timeOut: 3000});
				$scope.hasername = false;
				$scope.ername = null;
			})
			.catch(function(er){
				// tạo mới thất bại
				// hiển thị thông báo
				toastr.error(er.message, {timeOut: 3000});
				// lỗi tên danh mục
				$scope.hasername = !!er.error.name;
				$scope.ername = er.error.name[0];
				
			})
			.finally(function(){
				cfpLoadingBar.complete();
			})
		}
	});