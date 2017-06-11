angular.module('App')
.controller('EditCategoryCtrl', 
	function($scope, API, $stateParams, apiService, cfpLoadingBar, $stateParams, toastr) {

		cfpLoadingBar.start();
		// lấy id danh mục hiện tại
		var id = $stateParams.id;
		$scope.hasData = true;
		//gọi service apiService
		// lấy 1 danh mục theo id hiện tại
		var category = apiService.serviceAdmin('category',id);
		category.getOne()
		.then((d) => {
			if(d.data != null) { // nếu kết quả trả về có dữ liệu của id hiện tại
				$scope.hasData = true;
				$scope.category = d.data;
			} else { // nếu dữ liệu của id hiện tại không tồi tại
				$scope.hasData = false;
			}
		})
		.finally(function(){
			cfpLoadingBar.complete();
		})
		// lưu thông tin vừa chỉnh sửa danh mục
		$scope.save = function($stateParams){
			cfpLoadingBar.start();
			// gọi service apiService
			var category = apiService.serviceAdmin('category',id,$stateParams.data);
			category.put()
				.then(function(response){ // nếu update danh mục thành công
					toastr.success(response.message, {timeOut: 3000}); // hiển tị thông báo
				})
				.catch(function(er){ // nếu xảy ra lỗi
					toastr.error(er.message, {timeOut: 3000}); // hiển tị thông báo
					// lỗi tên danh mục
					$scope.hasername = !!er.error.name;
					$scope.ername = er.error.name[0];
				})
				.finally(function() {
			        cfpLoadingBar.complete();
			    });
		}
	});