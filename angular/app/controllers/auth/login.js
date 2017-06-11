angular.module('App')
.controller('LoginController', function($scope, $location, $auth, auth) {

    // đăng nhập
    $scope.login = function() {
        // thông tin user nhập
        var credentials = {
            email: $scope.email,
            password: $scope.password
        }
        $auth.login(credentials).then(function() { // đăng nhập thành công
            auth.getProfile().then(function(response) { // lấy thông tin của người dùng vừa đăng nhập
                localStorage.setItem("User", JSON.stringify(response.user)); // lưu vào localStorage
                $location.path('/'); // chuyển về trang chủ
            })
        })
        .catch(function(error) { // đăng nhập không thành công
            alert(error.data.error); // hiển thị thông báo
        });
    };

    $scope.authenticate = function(provider) {
        
        $auth.authenticate(provider)
        .then(function() {
            return auth.getProfile();
        })
        .then(function(response) {
            localStorage.setItem("User", JSON.stringify(response.user)); // lưu vào localStorage
            $location.path('/'); // chuyển về trang chủ
        })
        .catch(function(error) {
            if (error.message) {
                // Satellizer promise reject error.
                console.log(error.message);
            } else if (error.data) {
                // HTTP response error from server
                console.log(error.data.message, error.status);
            } else {
                console.log(error);
            }
        });
  };
});
