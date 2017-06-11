angular.module('App')
.factory('location', function($http, API, $q, $auth, apiService) {

	return {
		/**
		 * lấy danh sách quận/huyện theo id tỉnh/thành
		 * @param provinceid [description]
		 * @return promise [danh sách quận/huyện]
		 */
		getDistrictsByProvinceid: function(provinceid) {
			var deferred = $q.defer();
			// gọi apiService
		    apiService.service('districts',provinceid).getListByID()
		        .then(function (data) { // lấy được dữ liệu
		            deferred.resolve(data); // trả về dữ liệu
		        })
		        .catch(function (error) { // không lấy được dữ liệu
		            deferred.reject(error); // trả về lỗi
		        });
		    return deferred.promise;
		},
		/**
		 * lấy danh sách phường xã theo id quận/huyện
		 * @param districtid [description]
		 * @return {promise}            [danh sách phường/xã]
		 */
		getWardsByDistrictid: function(districtid) {
	        var deferred = $q.defer();
	        // gọi apiService
		    apiService.service('wards',districtid).getListByID()
		        .then(function (data) { // lấy được dữ liệu
		            deferred.resolve(data); // trả về dữ liệu
		        })
		        .catch(function (error) { // không lấy được dữ liệu
		            deferred.reject(error); // trả về lỗi
		        });
		    return deferred.promise;
		}
	};
});