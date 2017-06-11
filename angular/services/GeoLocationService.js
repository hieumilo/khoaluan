angular.module('App')
.factory('GeoLocationService', function($q, $window, $timeout) {
  var factoryObj = {};

  factoryObj.getPosition = function() {
    var deferred;
    var promiseTimeout = $timeout(function() {
      deferred.reject(1);
    }, 3000);

    deferred = $q.defer();

    if(!$window.navigator.geolocation) {
      $timeout.cancel(promiseTimeout);
      deferred.reject(false);
    }
    else {
      $window.navigator.geolocation.getCurrentPosition(function(position) {
        $timeout.cancel(promiseTimeout);
        return deferred.resolve(position);
      }, function(error) {
        $timeout.cancel(promiseTimeout);
        return deferred.reject(error.code || 1);
      });
    }

    return deferred.promise;
  };

  return factoryObj;
});