angular.module('App', [
    'ui.router', 'satellizer',
    'angularCSS', 'checklist-model',
    'datatables', 'datatables.bootstrap',
    'angular-loading-bar', 'toastr',
    'ngCookies','angularFileUpload'
])
.constant('API', 'http://api.khoaluan.com/')
.run([ '$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;   
}])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true; // Show the spinner.
    cfpLoadingBarProvider.includeBar = true; // Show the bar.
}])

.config(RoutesConfig)
.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

function RoutesConfig($stateProvider, $urlRouterProvider, $authProvider, $locationProvider, API) {
	// use the HTML5 History API
    // $locationProvider.html5Mode(true);
	
    $authProvider.loginUrl = API + 'auth/login';
    $authProvider.signupUrl = API + 'auth/signup';

    /**
     *  Satellizer config
     */
    $authProvider.facebook({
      clientId: '491224784419802'
    });

    $authProvider.google({
      clientId: 'YOUR_GOOGLE_CLIENT_ID'
    });
    // Facebook
    $authProvider.facebook({
        name: 'facebook',
        url: API + 'auth/facebook',
        authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
        redirectUri: window.location.origin + '/',
        requiredUrlParams: ['display', 'scope'],
        scope: ['email'],
        scopeDelimiter: ',',
        display: 'popup',
        oauthType: '2.0',
        popupOptions: { width: 580, height: 400 }
    });

    var loginRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }];

	/**
     * App routes
     */
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('register', {
            url: '/register',
            views: {
                'layout': { templateUrl: 'angular/app/views/home/index.html' },
                'header@register': {
                    templateUrl:'angular/app/views/home/blocks/header.html',
                    controller: 'HeaderController'
                },
                'footer@register': {
                    templateUrl:'angular/app/views/home/blocks/footer.html',
                    controller: 'FooterController'
                },
                'main@register': {
                    templateUrl: 'angular/app/views/auth/register.html',
                    controller: 'RegisterController'
                }
            },
            data : {
                pageTitle: 'Khóa luận - Đăng ký',
                bodyClass: 'hold-transition skin-purple layout-top-nav fixed'
            },
            resolve: {
                skipIfLoggedIn: function(auth){
                    return auth.skipIfLoggedIn();
                }
            }
        })
        .state('login', {
            url: '/login',
            views: {
                'layout': { templateUrl: 'angular/app/views/home/index.html' },
                'header@login': {
                    templateUrl:'angular/app/views/home/blocks/header.html',
                    controller: 'HeaderController'
                },
                'footer@login': {
                    templateUrl:'angular/app/views/home/blocks/footer.html',
                    controller: 'FooterController'
                },
                'main@login': {
                    templateUrl: 'angular/app/views/auth/login.html',
                    controller: 'LoginController'
                }
            },
            data : {
                pageTitle: 'Khóa luận - Đăng nhập',
                bodyClass: 'hold-transition skin-purple layout-top-nav fixed'
            },
            resolve: {
                skipIfLoggedIn: function(auth){
                    return auth.skipIfLoggedIn();
                }
            }
        })
        .state('profile', {
            url: '/thong-tin-nguoi-dung',
            views: {
                'layout': { templateUrl: 'angular/app/views/home/index.html' },
                'header@profile': {
                    templateUrl:'angular/app/views/home/blocks/header.html',
                    controller: 'HeaderController'
                },
                'footer@profile': {
                    templateUrl:'angular/app/views/home/blocks/footer.html',
                    controller: 'FooterController'
                },
                'main@profile': {
                    templateUrl: 'angular/app/views/auth/profile.html',
                    controller: 'ProfileController'
                }
            },
            data : {
                pageTitle: 'Khóa luận - Thông tin người dùng',
                bodyClass: 'hold-transition skin-purple layout-top-nav fixed'
            },
            resolve: {
                loginRequired: loginRequired
            }
        })
        .state('logout', {
            url: '/logout',
            views: {
                'layout': {
                    templateUrl: null,
                    controller: 'LogoutController'
                }
            }
        })
        // admin
        .state('admin', {
            abstract: true,
            views: {
                'layout': { templateUrl: 'angular/app/views/admin/index.html' },
                'navbar@admin': {
                    templateUrl:'angular/app/views/admin/blocks/navbar.html',
                    controller: 'NavbarCtrl'
                },
                'footer@admin': {
                    templateUrl:'angular/app/views/admin/blocks/footer.html'
                },
                main: {}
            },
            data : { bodyClass: 'hold-transition skin-purple sidebar-mini fixed' },
            resolve: {
                loginRequired: loginRequired,
                isAdmin: function(auth){
                    return auth.isAdmin();
                }
            }
        })
        // profile
        .state('admin.profile', {
            url: '/admin/profile',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/profile.html',
                    controller: 'ProfileCtrl'
                }
            },
            css: [
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Dashboard' }
        })
        // dashboard
        .state('admin.dashboard', {
            url: '/admin/dashboard',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/dashboard.html',
                    controller: 'DashboardController'
                }
            },
            css: [
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Dashboard' }
        })
        // location
        .state('admin.location', {
            url: '/admin/location',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/location/list.html',
                    controller: 'LocationCtrl'
                }
            },
            css: [
                'angular/public/plugins/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Location' }
        })
        // location restaurant
        .state('admin.location-restaurant', {
            url: '/admin/location/:name/:id',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/location/list-testaurant.html',
                    controller: 'LocationRestaurantCtrl'
                }
            },
            css: [
                'angular/public/plugins/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Location' }
        })
        // user
        .state('admin.user-list', {
            url: '/admin/user-list',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/user/list.html',
                    controller: 'ListUserCtrl'
                }
            },
            css: [
                'angular/public/plugins/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Category' }
        })
        .state('admin.user-edit', {
            url: '/admin/user-edit/:id',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/user/edit.html',
                    controller: 'EditUserCtrl'
                }
            },
            css: [
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css',
                'angular/public/node_modules/angular-toastr/dist/angular-toastr.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Create Category' }
        })
        // category
        .state('admin.category-list', {
            url: '/admin/category-list',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/category/list.html',
                    controller: 'ListCategoryCtrl'
                }
            },
            css: [
                'angular/public/plugins/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Category' }
        })
        .state('admin.category-create', {
            url: '/admin/category-create',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/category/create.html',
                    controller: 'CreateCategoryCtrl'
                }
            },
            css: [
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css',
                'angular/public/node_modules/angular-toastr/dist/angular-toastr.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Create Category' }
        })
        .state('admin.category-edit', {
            url: '/admin/category-edit/:id',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/category/edit.html',
                    controller: 'EditCategoryCtrl'
                }
            },
            css: [
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css',
                'angular/public/node_modules/angular-toastr/dist/angular-toastr.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Create Category' }
        })
        // restaurant
        .state('admin.restaurant-list', {
            url: '/admin/restaurant-list',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/restaurant/list.html',
                    controller: 'ListRestaurantCtrl'
                }
            },
            css: [
                'angular/public/plugins/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Restaurant' }
        })
        .state('admin.restaurant-application-list', {
            url: '/admin/restaurant-application-list',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/restaurant/list.html',
                    controller: 'ListRegisterRestaurantCtrl'
                }
            },
            css: [
                'angular/public/plugins/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Restaurant' }
        })
        .state('admin.restaurant-edit', {
            url: '/admin/restaurant-edit/:id',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/restaurant/edit.html',
                    controller: 'EditRestaurantCtrl'
                }
            },
            css: [
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css',
                'angular/public/node_modules/angular-toastr/dist/angular-toastr.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin restaurant' }
        })
        .state('admin.suggesstion-list', {
            url: '/admin/suggesstion-list',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/suggesstion/list.html',
                    controller: 'ListSuggesstionCtrl'
                }
            },
            css: [
                'angular/public/plugins/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css',
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin Suggesstion List' }
        })
        .state('admin.suggesstion-edit', {
            url: '/admin/suggesstion-edit/:id',
            views: {
                'main@admin': {
                    templateUrl: 'angular/app/views/admin/pages/suggesstion/edit.html',
                    controller: 'EditSuggesstionCtrl'
                }
            },
            css: [
                'angular/public/node_modules/angular-loading-bar/build/loading-bar.min.css',
                'angular/public/node_modules/angular-toastr/dist/angular-toastr.css'
            ],
            data : { pageTitle: 'Khóa luận - Admin suggesstion Edit' }
        })
		.state('home', {
            abstract: true,
            views: {
                'layout': { templateUrl: 'angular/app/views/home/index.html' },
                'header@home': {
                    templateUrl:'angular/app/views/home/blocks/header.html',
                    controller: 'HeaderController'
                },
                'footer@home': {
                    templateUrl:'angular/app/views/home/blocks/footer.html',
                    controller: 'FooterController'
                },
                main: {}
            },
            data : { bodyClass: 'hold-transition skin-purple layout-top-nav fixed' },
        })
        .state('home.page', {
            url: '/',
            views: {
                'main@home': {
                    templateUrl: 'angular/app/views/home/home-page.html',
                    controller: 'HomePageController'
                }
            },
            data : { pageTitle: 'Khóa luận - Trang chủ' }
        })
        // đăng ký địa điểm
        .state('home.createRestaurant', {
            url: '/them-dia-diem',
            views: {
                'main@home': {
                    templateUrl: 'angular/app/views/home/pages/user/create-restaurant.html',
                    controller: 'CreateRestaurantController'
                }
            },
            data : { pageTitle: 'Khóa luận - Thêm địa điểm' },
            resolve: {
                loginRequired: loginRequired
            }
        })
        // quản lý địa điểm
        // thông tin địa điểm kèm theo danh sách món ăn
        .state('home.user-restaurant-foods', {
            url: '/quan-ly-dia-diem/:id/danh-sach-mon-an',
            views: {
                'main@home': {
                    templateUrl: 'angular/app/views/home/pages/user/restaurant-foods.html',
                    controller: 'UserRestaurantFoodsController'
                }
            },
            data : { pageTitle: 'Khóa luận - Danh sách địa điểm' },
            resolve: {
                loginRequired: loginRequired
            }
        })
        // cập nhật thông tin địa điểm
        .state('home.user-restaurant-edit', {
            url: '/quan-ly-dia-diem/:id/cap-nhat',
            views: {
                'main@home': {
                    templateUrl: 'angular/app/views/home/pages/user/edit-restaurant.html',
                    controller: 'UserEditRestaurantController'
                }
            },
            data : { pageTitle: 'Khóa luận - Cập nhật địa điểm' },
            resolve: {
                loginRequired: loginRequired
            }
        })
        // quản lý món ăn trong địa điểm
        // thêm mới món
        .state('home.user-restaurant-food-create', {
            url: '/quan-ly-dia-diem/:id/them-mon-an',
            views: {
                'main@home': {
                    templateUrl: 'angular/app/views/home/pages/user/create-food.html',
                    controller: 'UserCreateFoodController'
                }
            },
            data : { pageTitle: 'Khóa luận - Thêm mới món ăn' },
            resolve: {
                loginRequired: loginRequired
            }
        })
        // cập nhật mới món
        .state('home.user-restaurant-food-edit', {
            url: '/quan-ly-dia-diem/:restaurantid/cap-nhat-mon-an/:id',
            views: {
                'main@home': {
                    templateUrl: 'angular/app/views/home/pages/user/edit-food.html',
                    controller: 'UserEditFoodController'
                }
            },
            data : { pageTitle: 'Khóa luận - Cập nhật món ăn' },
            resolve: {
                loginRequired: loginRequired
            }
        })
        // tìm kiếm địa điểm
        .state('home.search', {
            url: '/tim-kiem?search',
            views: {
                'main@home': {
                    templateUrl: 'angular/app/views/home/pages/search.html',
                    controller: 'SearchController'
                }
            },
            data : { pageTitle: 'Khóa luận - Tìm kiếm' }
        })
        // danh sách địa điểm theo danh mục
        .state('home.category', {
            // url: '/:name/:id',
            views: {
                'main@home': {
                    templateUrl: 'angular/app/views/home/pages/category.html',
                    controller: 'CategoryController'
                }
            },
            data : { pageTitle: 'Khóa luận - Trang chủ' }
        })
        .state('home.category.list', {
            url: '/:name/:id',
            views: {
                '': {
                    templateUrl: 'angular/app/views/home/pages/cate-list.html',
                    controller: 'CategoryController'
                }
            },
            data : { pageTitle: 'Khóa luận - Trang chủ' }
        })
        // chi tiết địa điểm
        .state('home.restaurant', {
            url: '/dia-diem/:name/:id',
            views: {
                'main@home': {
                    templateUrl: 'angular/app/views/home/pages/restaurant.html',
                    controller: 'RestaurantController'
                }
            },
            data : { pageTitle: 'Khóa luận - Chi tiết' }
        })
        
}