angular.module('App')
.controller('LocationRestaurantCtrl', 
	function($scope, API, $stateParams, DTOptionsBuilder, DTColumnBuilder, 
			$compile, apiService, cfpLoadingBar, toastr, $state) {

		console.log($stateParams);

		cfpLoadingBar.start();

		// function row calback
		var fnRowCallback = (nRow, aData, iDisplayIndex, iDisplayIndexFull) => {
			$compile(nRow)($scope);
		}
		// function action html(hiển thị nút sửa với xóa)
		var actionsHtml = (data) => {
      		return `
                <div class="btn-group">
      				<a class="btn btn-info" ui-sref="admin.restaurant-edit({id: ` + data.id + `})">
      					<i class="fa fa-lg fa-edit"></i>
      				</a>
      				<button class="btn btn-warning" ng-click="delete(${data.id})">
      					<i class="fa fa-lg fa-trash"></i>
      				</button>
      			</div>
                `
    	}
    	// gọi service apiService
    	// lấy danh sách danh mục
    	var categories = apiService.serviceAdmin('location/'+$stateParams.name+'/'+$stateParams.id);
    	// tạo datatable theo promise
		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
                return categories.getList()
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
		// tạo datatable với 3 cột
		$scope.dtColumns = [
			DTColumnBuilder.newColumn('id').withTitle('ID').notSortable(),
			DTColumnBuilder.newColumn('name').withTitle('Name'),
			DTColumnBuilder.newColumn('email').withTitle('Email'),
			DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
		];

		$scope.delete = function(id) {
			if(confirm('Bạn có chắc muốn xóa địa điểm này ??')){ // nếu muốn xóa
	    		var category = apiService.serviceAdmin('restaurant',id);
				category.remove()
				.then(function(response){
					alert(response.message)
					$state.reload()
				})
				.catch(function() {
					console.log('error')
				})
	    	}
		}
	})