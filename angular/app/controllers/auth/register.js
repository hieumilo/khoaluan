angular.module('App')
.controller('RegisterController', function($scope, $location, $auth, apiService) {
    // gọi service apiService
    // lấy danh sách tỉnh/thành
    apiService.service('provinces').getList()
    .then(function(d){ // thành công
        $scope.provinces = d.data; // danh sách tỉnh thành
    })
    // đăng ký
    $scope.signup = function() {
        if($scope.check) { // đã check điều khoản
            $auth.signup($scope.user) // đăng ký
            .then(function(response) { // thành công
                $location.path('/'); // chuyển hướng về trang chủ
            })
            .catch(function(er) { // thất bại
                //lỗi tên người dùng
                if($scope.hasername = !!er.data.error.name) {
                    $scope.ername = er.data.error.name[0];
                } else {
                    $scope.ername = null;
                }
                // lỗi email
                if($scope.haseremail = !!er.data.error.email) {
                    $scope.eremail = er.data.error.email[0];
                } else {
                    $scope.eremail = null;
                }
                // lỗi mật khẩu
                if($scope.haserpassword = !!er.data.error.password) {
                    $scope.erpassword = er.data.error.password[0];
                } else {
                    $scope.erpassword = null;
                }
                // lỗi nhập lại mật khẩu
                if($scope.haserrepassword = !!er.data.error.repassword) {
                    $scope.errepassword = er.data.error.repassword[0];
                } else {
                    $scope.errepassword = null;
                }
                // lỗi địa chỉ
                if($scope.haseraddress = !!er.data.error.address) {
                    $scope.eraddress = er.data.error.address[0];
                } else {
                    $scope.eraddress = null;
                }
            });
        }
    };
});
