angular.module('App')
.controller('ListCategoryCtrl', 
	function($scope, DTOptionsBuilder, DTColumnBuilder, 
			$compile, apiService, cfpLoadingBar, API, $state) {

		cfpLoadingBar.start();

		// function row calback
		var fnRowCallback = (nRow, aData, iDisplayIndex, iDisplayIndexFull) => {
			$compile(nRow)($scope);
		}
		// function action html(hiển thị nút sửa với xóa)
		var actionsHtml = (data) => {
      		return `
                <div class="btn-group">
      				<a class="btn btn-info" ui-sref="admin.category-edit({id: ` + data.id + `})">
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
    	var categories = apiService.serviceAdmin('category');
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
			DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
		];
		// xóa 1 danh mục trong danh sách
	    $scope.delete = function(id){
	    	// hiển thị thông báo muốn xóa hay không
	    	if(confirm('delete ??')){ // nếu muốn xóa
	    		var category = apiService.serviceAdmin('category',id);
				category.remove()
				.then(function(response){
					console.log(response.message)
					$state.reload()
				})
				.catch(function() {
					console.log('error')
				})
	    	}
			
	    }
	    
	});