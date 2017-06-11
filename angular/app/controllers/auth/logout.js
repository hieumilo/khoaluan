angular.module('App')
.controller('LogoutController', function($auth, $state) {
    if (!$auth.isAuthenticated()) { // nếu chưa có đăng nhập
        return;
    }
    // đăng xuất
    $auth.logout()
        .then(function() {
            localStorage.removeItem("User"); // xóa thông tin người dùng ở localStorage
            $state.go('home.page', {}, {reload: true}); // chuyển hướng về trang chủ
        });
});
