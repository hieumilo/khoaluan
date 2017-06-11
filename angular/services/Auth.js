angular.module('App')
.factory('auth', function($http, API, $q, $auth) {

	return {
		/**
		 * kiểm tra đăng nhập
		 * @return promise
		 */
		isAuthenticated: function() {
			var deferred = $q.defer();
	        if ($auth.isAuthenticated()) { // có đăng nhập
	            deferred.resolve(); // đi tiếp
	        } else { // không có đăng nhập
	            deferred.reject(); // quay về
	        }
	        return deferred.promise;
		},
		/**
		 * bỏ qua đăng nhập
		 * @return promise [description]
		 */
		skipIfLoggedIn: function() {
			var deferred = $q.defer();
	        if ($auth.isAuthenticated()) { // có đăng nhập
	            deferred.reject(); // quay về
	        } else { // không có đăng nhập
	            deferred.resolve(); // đi tiếp
	        }
	        return deferred.promise;
		},
		/**
		 * check quyền admin
		 * @return promise [description]
		 */
		isAdmin: function(){
	        var deferred = $q.defer();
	        var user = angular.fromJson(localStorage.getItem("User"));
	        if (user.level == 0) { // có quyền admin
	            deferred.resolve(); // đi tiếp
	        } else { // không có quyền admin
	            deferred.reject(); // quay về
	        }
	        return deferred.promise;
	    },
	    /**
	     * lấy thông tin user hiện tại
	     * @return promise [description]
	     */
		getProfile: function() {
			var deferred = $q.defer();
		    $http.get(API + 'auth/me')
		        .success(function (data) { // lấy được thông tin thành công
		            deferred.resolve(data); // trả về dữ liệu
		        })
		        .error(function (error) { // thất bại
		            deferred.reject(error);
		        });
		    return deferred.promise;
		},
		/**
		 * lấy thông tin user hiện tại lưu ở localStorage
		 * @return
		 */
		getCurrentUser: function() {
			return angular.fromJson(localStorage.getItem("User"));
		},
		/**
		 * kiểm tra quyền admin ờ thông tin lưu ở localStorage
		 * @return {[type]} [description]
		 */
		checkAdmin: function() {
	        var user = angular.fromJson(localStorage.getItem("User"));
	        if (user.level == 0) { // có quyền admin
	            return true;
	        } else { // không có
	            return false;
	        }
		}
	};
});