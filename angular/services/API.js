angular.module('App')
.factory('apiService', function($http, API, $q) {

	/**
	 * lấy dữ liệu từ server thông qua url
	 * @param  url
	 * @return promise
	 */
	function get(url) {
	    var deferred = $q.defer();
	    $http.get(url)
	        .success(function (data) {
	            deferred.resolve(data);
	        })
	        .error(function (error) {
	            deferred.reject(error);
	        });
	    return deferred.promise;
	}

	/**
	 * gửi dữ liệu lên server thông qua url theo phương thức post
	 * @param  url
	 * @param  data
	 * @return promise
	 */
	function post(url, data){
		var deferred = $q.defer();
        $http.post(url,data)
	        .success(function (data) {
	            deferred.resolve(data);
	        }).error(function (data, status) {
	            deferred.reject(data);
	        });
        return deferred.promise;
	}
	function postWithFile(url, data){
		var deferred = $q.defer();
        $http({
        	method: 'POST',
        	url: url,
        	headers: {
                'Content-Type': undefined
            },
        	data: data,
    	}).success(function (data) {
            deferred.resolve(data);
        }).error(function (data, status) {
            deferred.reject(data);
        });
        return deferred.promise;
	}

	/**
	 * gửi dữ liệu lên server thông qua url theo phương thức put
	 * @param  url
	 * @param  data
	 * @return promise
	 */
	function put(url, data){
		var deferred = $q.defer();
        $http.put(url,data)
	        .success(function (data) {
	            deferred.resolve(data);
	        }).error(function (data, status) {
	            deferred.reject(data);
	        });
        return deferred.promise;
	}
	function putWithFile(url, data){
		var deferred = $q.defer();
        $http({
        	method: 'PUT',
        	url: url,
        	headers: {
                'Content-Type': undefined
            },
        	data: data
    	}).success(function (data) {
            deferred.resolve(data);
        }).error(function (data, status) {
            deferred.reject(data);
        });
        return deferred.promise;
	}

	/**
	 * xóa thông tin trên server thông qua url
	 * @param  url
	 * @return promise
	 */
	function remove(url){
		var deferred = $q.defer();
        $http.delete(url)
	        .success(function (data) {
	            deferred.resolve(data);
	        }).error(function (data, status) {
	            deferred.reject(data);
	        });
        return deferred.promise;
	}
	// service trả về các phương thức
	return {
		/**
		 * dành cho admin
		 * @param  name [tên mà user muốn truy xuất đến]
		 * @param  id   [có thể có hoặc không]
		 * @param  data [có thể có hoặc không]
		 * @return {[type]}      [description]
		 */
		serviceAdmin: function(name,id = null, data = null){
			return {
				// lấy danh sách theo name
				getList: function(){
					return get(API + 'admin/' + name);
				},
				// lấy danh sách theo name và id
				getListByID: function(){
					return get(API + 'admin/' + name + '/' + id);
				},
				// lấy 1 dòng dữ liệu theo name và id
				getOne: function(){
					return get(API + 'admin/' + name + '/' + id);
				},
				// gửi dữ liệu lên server theo tên kèm theo data
				post: function(){
					return post(API + 'admin/' + name, data);
				},
				// gửi dữ liệu lên server theo tên kèm theo data
				put: function(){
					return put(API + 'admin/' + name + '/' + id, data);
				},
				// xóa
				remove: function(){
					return remove(API + 'admin/' + name + '/' + id);
				}
			}
		},
		/**
		 * dành cho toàn bộ user
		 * @param  name [tên mà user muốn truy xuất đến]
		 * @param  id   [có thể có hoặc không]
		 * @param  data [có thể có hoặc không]
		 * @return {[type]}      [description]
		 */
		service: function(name,id = null, data = null, option = null){
			return {
				// lấy danh sách theo name
				getList: function(){
					var url = API + name;
					if(option != null) {
						url += "?";
						angular.forEach(option, function(value,key) {
							url += key + "=" + value + "&";
						})
					}
					return get(url);
				},
				// lấy danh sách theo name và id
				getListByID: function(){
					var url = API + name + '/' + id;
					if(option != null) {
						url += "?";
						angular.forEach(option, function(value,key) {
							url += key + "=" + value + "&";
						})
					}
					return get(url);
				},
				// lấy 1
				getOne: function(){
					return get(API + name + '/' + id);
				},
				// post
				post: function(){
					return post(API + name, data);
				},
				postRestaurant: function(){
					return postWithFile(API + name, data);
				},
				putRestaurant: function(){
					return postWithFile(API + name + '/' + id, data);
				},
				postWithFile: function(){
					if(id) {
						return postWithFile(API + name + '/' + id, data);
					} else {
						return postWithFile(API + name, data);
					}
					
				},
				// xóa
				remove: function(){
					return remove(API + name + '/' + id);
				}
			}
		}
	};
});