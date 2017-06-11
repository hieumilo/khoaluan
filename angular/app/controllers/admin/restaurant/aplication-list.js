angular.module('App')
.controller('ListRegisterRestaurantCtrl', 
	function($scope, DTOptionsBuilder, DTColumnBuilder, 
			$compile, apiService, cfpLoadingBar, API, $state) {

		cfpLoadingBar.start();
		// function row calback
		var fnRowCallback = (nRow, aData, iDisplayIndex, iDisplayIndexFull) => {
			$compile(nRow)($scope);
		}
		// function action html(hiển thi nút edit và nút delete)
		var actionsHtml = (data) => {
      		return `
      			<div class="btn-group">
      				<a class="btn btn-info" ui-sref="admin.restaurant-edit({id: ` + data.id + `})">
      					<i class="fa fa-lg fa-edit"></i>
      				</a>
      				<button class="btn btn-warning" ng-click="delete(${data.id})">
      					<i class="fa fa-lg fa-trash"></i>
      				</button>
      			</div>`
    	}
    	// gọi service apiService
    	var restaurant = apiService.serviceAdmin('register-restaurant');
    	// tạo datatable hiển thị danh sách restaurant
		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
                return restaurant.getList() // lấy danh sách restaurant
	                .then(function(d){
	                	return d.data;
	                })
	                .finally(function() {
				        cfpLoadingBar.complete();
				    });
            })
			.withDataProp('data')
			.withOption('fnRowCallback', fnRowCallback)
			.withBootstrap();
		// tạo datatable với 4 cột
		$scope.dtColumns = [
			DTColumnBuilder.newColumn('id').withTitle('ID').notSortable(),
			DTColumnBuilder.newColumn('name').withTitle('Tên địa điểm'),
			DTColumnBuilder.newColumn('email').withTitle('Email'),
			DTColumnBuilder.newColumn('place').withTitle('Địa chỉ'),
			DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
		];
		// xóa 1 restaurant
	    $scope.delete = function(id){
	    	// hỏi xem có muốn xóa hay không
	    	if(confirm('delete ??')){ // nếu muốn xóa
	    		// gọi service apiService
	    		// lấy 1 restaurant có id = id truyền vào
	    		var restaurant = apiService.serviceAdmin('register-restaurant',id);
				restaurant.remove()
					.then(function(response){ // xóa thành công restaurant
						console.log(response.message)
						$state.reload() // reload trang
					})
					.catch(function() { // nếu có lỗi xảy ra
						console.log('error')
					})
	    	}
			
	    }
	    
	});