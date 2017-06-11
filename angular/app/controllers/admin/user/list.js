angular.module('App')
.controller('ListUserCtrl', 
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
      				<a class="btn btn-info" ui-sref="admin.user-edit({id: ` + data.id + `})">
      					<i class="fa fa-lg fa-edit"></i>
      				</a>
      				<button class="btn btn-warning" ng-click="delete(${data.id})">
      					<i class="fa fa-lg fa-trash"></i>
      				</button>
      			</div>`
    	}
    	// gọi service apiService
    	var user = apiService.serviceAdmin('user');
    	// tạo datatable hiển thị danh sách user
		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
                return user.getList() // lấy danh sách user
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
			DTColumnBuilder.newColumn('name').withTitle('Name'),
			DTColumnBuilder.newColumn('email').withTitle('Email'),
			DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
		];
		// xóa 1 user
	    $scope.delete = function(id){
	    	// hỏi xem có muốn xóa hay không
	    	if(confirm('delete ??')){ // nếu muốn xóa
	    		// gọi service apiService
	    		// lấy 1 user có id = id truyền vào
	    		var user = apiService.serviceAdmin('user',id);
				user.remove()
					.then(function(response){ // xóa thành công user
						console.log(response.message)
						$state.reload() // reload trang
					})
					.catch(function() { // nếu có lỗi xảy ra
						console.log('error')
					})
	    	}
			
	    }
	    
	});