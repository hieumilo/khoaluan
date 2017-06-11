angular.module('App')
.controller('UserEditRestaurantController', 
	function($scope, $http, $stateParams, apiService, location, $cookies, auth, FileUploader) {

	var restaurant_id = $stateParams.id;

	apiService.service('user/restaurant',restaurant_id).getListByID()
	.then(function(d){
		$scope.restaurant = d.data;
	})

	// khởi tạo giờ, phút
	$scope.times = ['01','02','03','04','05','06','07','08','09','10','11','12',
					'13','14','15','16','17','18','19','20','21','22','23','24'];
	$scope.minutes = ['00','15','30','45'];

	// lấy danh sách danh mục
	apiService.service('category').getList()
	.then(function(d){
		$scope.categories = d.data;
	})

	// lấy danh sách tỉnh/thành
	apiService.service('provinces').getList()
	.then(function(d){
		$scope.provinces = d.data;
	})

	// khởi tạo tỉnh thành hiện tại
	$scope.province = {provinceid: $cookies.get('loc')}
	// lấy danh sách quận/huyện
	location.getDistrictsByProvinceid($cookies.get('loc'))
	.then(function(d){
		// trả về danh sách quận/huyện
		$scope.districts = d.data;
	})

	// thay đổi tỉnh thành
	$scope.changProvince = function(){
		// lấy id của tỉnh thành vừa thay đổi
		var province = $scope.province.provinceid;
		// lấy danh sách quận/huyện
		location.getDistrictsByProvinceid(province)
		.then(function(d){
			// trả về danh sách quận/huyện
			$scope.districts = d.data;
		})
		.catch(function(){
			toastr.error("Đã có lỗi xảy ra", {timeOut: 3000});
		})
		.finally(function() {
		});
	}

	// thay đổi quận/huyện
	$scope.changeDistrict = function(){
		// lấy id của quận/huyện vừa thay đổi
		var district = $scope.district.districtid;
		// lấy danh sách phường/xã
		location.getWardsByDistrictid(district)
		.then(function(d){
			// trả về danh sách phường/xã
			$scope.wards = d.data;
		})
		.catch(function(er){
			console.log(er)
		})
		.finally(function() {
		});
	}

	// lấy user id
	auth.getProfile()
    .then(function(d){
        $scope.restaurant = {userid: d.user.id};
    })

	var restaurant_id = $stateParams.id;

	apiService.service('user/restaurant',restaurant_id).getListByID()
	.then(function(d){
		$scope.restaurant = d.data;
		$scope.time = {
			timeOpen : d.data.open.split(':')[0],
			minuteOpen : d.data.open.split(':')[1],
			timeClose : d.data.close.split(':')[0],
			minuteClose : d.data.close.split(':')[1]
		};
	})

    var uploader = $scope.uploader = new FileUploader();

    uploader.onAfterAddingFile = function(fileItem) {
        uploader.queue = [fileItem];
        console.log(1);
        console.info('uploader', uploader);
        console.info('onAfterAddingFile', fileItem);
    };

	// gửi toàn bộ thông tin lên server
	$scope.save = function($stateParams){
		console.log($stateParams.restaurant.id);

    	var formData = new FormData();

    	angular.forEach(uploader.queue, function(value, key) {
            formData.append('file', value._file)
        });

		// nếu có chọn giờ, phút mở, đóng cửa
		if(typeof($stateParams.time) != "undefined") {
			// nếu chọn cả giở và phút mở cửa
			if(typeof($stateParams.time.timeOpen) != "undefined" && typeof($stateParams.time.minuteOpen) != "undefined") {
				// đặt thời gian mở cửa = giờ + phút mở cửa
				$stateParams.restaurant.open = $stateParams.time.timeOpen + ":" + $stateParams.time.minuteOpen;
			}
			// nếu chọn cả giở và phút đóng cửa
			if(typeof($stateParams.time.timeClose) != "undefined" && typeof($stateParams.time.minuteClose) != "undefined") {
				// đặt thời gian đóng cửa = giờ + phút đóng cửa
				$stateParams.restaurant.close = $stateParams.time.timeClose + ":" + $stateParams.time.minuteClose;
			}
		}

		angular.forEach($stateParams.restaurant, function(value, key){
            formData.append(key, value);
        });

		// gọi service tạo mới địa điểm
		var restaurant = apiService.service('user/restaurant',$stateParams.restaurant.id,formData);
		restaurant.putRestaurant().then(function(response){
			// tạo mới địa điểm thành công
			// console.log(response);
			$scope.restaurant = response.data;
			$scope.time = {
				timeOpen : response.data.open.split(':')[0],
				minuteOpen : response.data.open.split(':')[1],
				timeClose : response.data.close.split(':')[0],
				minuteClose : response.data.close.split(':')[1]
			};
			$scope.restaurant.min = parseInt(response.data.min)
			$scope.restaurant.max = parseInt(response.data.max)
			alert(response.message)
		})
		.catch(function(er){
			// tạo mới địa điểm bị lỗi
			// lỗi tên địa điểm
			if($scope.hasername = !!er.error.name){
				$scope.ername = er.error.name[0];
			} else {
				$scope.ername = null;
			}
			// lỗi số điện thoại
			if($scope.haserphone = !!er.error.phone){
				$scope.erphone = er.error.phone[0];
			} else {
				$scope.erphone = null;
			}
			// lỗi email
			if($scope.haseremail = !!er.error.email){
				$scope.eremail = er.error.email[0];
			} else {
				$scope.eremail = null;
			}
			// lỗi danh mục
			if($scope.hasercategory = !!er.error.categoryid){
				$scope.ercategory = er.error.categoryid[0];
			} else {
				$scope.ercategory = null;
			}
			// lỗi thời gian mở cửa
			if($scope.haseropen = !!er.error.open){
				$scope.eropen = er.error.open[0];
			} else {
				$scope.eropen = null;
			}
			// lỗi thời gian đóng cửa
			if($scope.haserclose = !!er.error.close){
				$scope.erclose = er.error.close[0];
			} else {
				$scope.erclose = null;
			}
			// lỗi giá thấp nhất
			if($scope.hasermin = !!er.error.min){
				$scope.ermin = er.error.min[0];
			} else {
				$scope.ermin = null;
			}
			// lỗi giá cao nhất
			if($scope.hasermax = !!er.error.max){
				$scope.ermax = er.error.max[0];
			} else {
				$scope.ermax = null;
			}
			// lỗi địa điểm
			if($scope.haserplace = !!er.error.place){
				$scope.erplace = er.error.place[0];
			} else {
				$scope.erplace = null;
			}
			// lỗi khu vực
			if($scope.haserwardid = !!er.error.wardid){
				$scope.erwardid = er.error.wardid[0];
			} else {
				$scope.erplace = null;
			}
			
		})
	}
});