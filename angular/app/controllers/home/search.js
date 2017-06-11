angular.module('App')
.controller('SearchController', function($scope, apiService, $location, $cookies) {

	$scope.searchText = $location.search().search;
	var option = {
		search: $scope.searchText,
		provinceid: $cookies.get('loc')
	};
	apiService.service('restaurant',null,null,option).getList()
	.then(function(d) {
		$scope.total = d.data.total
		if(d.data.data.length == 0) {
			$scope.hasData = false;
		} else {
			$scope.hasData = true;
			$scope.res = d.data.data
		}
	})

	$scope.lastpage = 1;

	// load more
	$scope.loadMore = function(orderBy) {
        $scope.lastpage += 1;

        option.page = $scope.lastpage;
        apiService.service('restaurant',null,null,option).getList()
        .then(function(d) {
			$scope.res = $scope.res.concat(d.data.data);
        })
    };

});