angular.module('App')
.controller('LocationCtrl', 
	function($scope, API, $stateParams, DTOptionsBuilder, DTColumnBuilder, 
			$compile, apiService, cfpLoadingBar, toastr) {

		cfpLoadingBar.start();

		// function row calback
		var fnRowCallback = (nRow, aData, iDisplayIndex, iDisplayIndexFull) => {
			$compile(nRow)($scope);
		}

		function actionsHtml(data) {
			var id = Object.keys(data)[0];
			return `
				<a class="btn btn-xs btn-warning" href="#/admin/location/`+Object.keys(data)[0]+`/`+data[id]+`">
	                <i class="fa fa-edit">Chi tiết</i>
	            </a>
			`;
		}

		// lấy danh sách tỉnh/thành
		var provinces = apiService.service('provinces');
		provinces.getList()
			.then(function(d){
				// trả về danh sách tinht/thành hiển thị ở select
				$scope.provinces = d.data;
			})
			.catch(function(){
				toastr.error("Đã có lỗi xảy ra", {timeOut: 3000});
			})
			.finally(function() {
		        cfpLoadingBar.complete();
		    });
		// tạo datatable danh sách tỉnh/thành
		$scope.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('ajax', {
					url: API + 'provinces',
					type: 'GET'
				})
		    .withDataProp('data')
		    .withOption('fnRowCallback', fnRowCallback)
		    .withBootstrap();
		   // tạo datatable với 2 cột
		$scope.dtColumns = [
			// DTColumnBuilder.newColumn('provinceid').withTitle('ID').notSortable(),
			DTColumnBuilder.newColumn('type').withTitle('Type'),
			DTColumnBuilder.newColumn('name').withTitle('Tên'),
			DTColumnBuilder.newColumn('total').withTitle('Số địa điểm'),
			DTColumnBuilder.newColumn(null).withTitle('Chi tiết').notSortable().renderWith(actionsHtml)
		];
		// thay đổi tinht/thành
		$scope.changeProvince = function(){
			// lấy id tỉnh/thành vừa thay đổi
			var province = $scope.province;
			// gọi service apiService
			// lấy danh sách quận/huyện
			var districts = apiService.service('districts',province);
			districts.getListByID()
				.then(function(d){
					// trả về danh sách quận/huyện và hiển thị ở select
					$scope.districts = d.data;
				})
				.catch(function(){
					toastr.error("Đã có lỗi xảy ra", {timeOut: 3000});
				})
				.finally(function() {
			        cfpLoadingBar.complete();
			    });
			// tạo datatable quận/huyện
			$scope.dtOptions = DTOptionsBuilder.newOptions()
				.withOption('ajax', {
						url: API + 'districts/' + province,
						type: 'GET'
					})
			    .withDataProp('data')
			    .withOption('fnRowCallback', fnRowCallback)
			    .withBootstrap();
			// tạo datatable với 3 cột
		    $scope.dtColumns = [
				// DTColumnBuilder.newColumn('id').withTitle('ID').notSortable(),
				DTColumnBuilder.newColumn('type').withTitle('Type'),
				DTColumnBuilder.newColumn('name').withTitle('Name'),
				DTColumnBuilder.newColumn('location').withTitle('Location'),
				DTColumnBuilder.newColumn('total').withTitle('Số địa điểm'),
				DTColumnBuilder.newColumn(null).withTitle('Chi tiết').notSortable().renderWith(actionsHtml)
		    ];
		};
		// thay đổi quận/huyện
		$scope.changeDistrict = function(){
			cfpLoadingBar.start();
			// lấy id quận/huyện vừa thay đổi
			var district = $scope.district;
			// gọi service apiService
			// lấy danh sách phường/xã
			var wards = apiService.service('wards',district);
			// tạo datatable phường/xã
			$scope.dtOptions = DTOptionsBuilder.newOptions()
				.withOption('ajax', {
						url: API + 'wards/' + district,
						type: 'GET'
					})
			    .withDataProp('data')
			    .withOption('fnRowCallback', fnRowCallback)
			    .withBootstrap();
			// tạo datatable phường/xã với 3 cột
			$scope.dtColumns = [
				// DTColumnBuilder.newColumn('provinceid').withTitle('ID').notSortable(),
				DTColumnBuilder.newColumn('type').withTitle('Type'),
				DTColumnBuilder.newColumn('name').withTitle('Name'),
				DTColumnBuilder.newColumn('location').withTitle('Location'),
				DTColumnBuilder.newColumn('total').withTitle('Số địa điểm'),
				DTColumnBuilder.newColumn(null).withTitle('Chi tiết').notSortable().renderWith(actionsHtml)
			];
			cfpLoadingBar.complete();
		}
		$scope.delete = function(data){
	    	
	    	console.log(data);
			
	    }
	});