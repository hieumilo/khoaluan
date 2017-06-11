angular.module('App')
.controller('FooterController', 
	function($scope, apiService, $stateParams) {

		$scope.send = function($stateParams) {
			console.log($stateParams.suggess);
			apiService.service('suggesstion', null, $stateParams.suggess).post()
			.then(function(d) {
				alert(d.message)
			})
			.catch(function(er) {
				if($scope.haseremail = !!er.error.email){
					$scope.eremail = er.error.email[0];
				} else {
					$scope.eremail = null;
				}
				if($scope.hasertitle = !!er.error.title){
					$scope.ertitle = er.error.title[0];
				} else {
					$scope.ertitle = null;
				}
				if($scope.hasercontent = !!er.error.content){
					$scope.ercontent = er.error.content[0];
				} else {
					$scope.ercontent = null;
				}
			})
		}

	})