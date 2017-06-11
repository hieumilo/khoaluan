<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
	return view('index');
});

Route::group(['domain' => 'api.khoaluan.com'], function () {

	Route::post('auth/signup', 'AuthenticateController@signup');
	Route::post('auth/login', 'AuthenticateController@authenticate');
	Route::post('auth/facebook', 'AuthenticateController@facebook');
	Route::get('auth/me', 'AuthenticateController@getAuthenticatedUser');
	Route::get('auth/me/notification', 'AuthenticateController@getUserNotification');
	Route::get('auth/me/change-noti/{id}', 'AuthenticateController@getUserChangeNoti');
	Route::post('auth/me/change-pass', 'AuthenticateController@change_pass');

	Route::group(['prefix' => 'admin', 'middleware' => ['jwt.auth', 'isAdmin'], 'namespace' => 'Admin'], function() {

		// dashboard
		Route::get('dashboard', 'DashboardController@index');

		// user
		Route::resource('user', 'UserController', ['only' => [
		    'index', 'show', 'update', 'destroy'
		]]);
		// category
		Route::resource('category', 'CategoryController', ['only' => [
		    'index', 'store', 'show', 'update', 'destroy'
		]]);
		// restaurant
		Route::get('restaurant', 'RestaurantController@listRestaurant');
		Route::get('register-restaurant', 'RestaurantController@listRegisterRestaurant');
		Route::get('restaurant/{id}', 'RestaurantController@show');
		Route::put('restaurant/{id}', 'RestaurantController@update');
		Route::delete('restaurant/{id}', 'RestaurantController@delete');
		// suggesstion
		Route::get('suggesstion', 'SuggesstionController@index');
		Route::get('suggesstion/{id}', 'SuggesstionController@show');
		Route::post('suggesstion', 'SuggesstionController@send');

	});
	
    // location
	Route::get('provinces', 'LocationController@getProvinces');
	Route::get('province/{provinceid}', 'LocationController@getProvince');
	Route::get('districts/{provinceid}', 'LocationController@getDistrictsByProvince');
	Route::get('district/{provinceid}', 'LocationController@getDistrict');
	Route::get('wards/{districtid}', 'LocationController@getWardsByDistrict');
	Route::get('ward/{districtid}', 'LocationController@getWard');
	Route::get('admin/location/{name}/{id}', 'LocationController@getRestaurant');
	//restaurant
	Route::get('restaurant', 'RestaurantController@index');
	Route::get('restaurant/{id}', 'RestaurantController@show');
	//food
	Route::get('foods/{id}', 'RestaurantController@getFoodsByRestaurantid');
	// category
	Route::get('category', 'CategoryController@index');

	Route::group(['prefix' => 'user', 'middleware' => 'jwt.auth' , 'namespace' => 'UserRestaurant'], function() {
		Route::get('restaurant', 'RestaurantController@index');
		Route::post('restaurant', 'RestaurantController@store');
		Route::get('restaurant/{id}', 'RestaurantController@show');
		Route::post('restaurant/{id}', 'RestaurantController@update');

		Route::get('restaurant/foods/{id}', 'FoodController@index');
		Route::post('restaurant/food/{id}', 'FoodController@store');
		Route::get('restaurant/food/{id}', 'FoodController@show');
		Route::post('restaurant/food/edit/{id}', 'FoodController@update');
		Route::delete('restaurant/food/{id}', 'FoodController@delete');
	});

	// gửi góp ý
	Route::post('suggesstion', 'SuggesstionController@store');
	// bình luận
	Route::get('comment/{id}', 'CommentController@index');
	Route::post('comment', 'CommentController@store');
	// đánh giá
	Route::get('evaluation', 'EvaluationController@check');
	Route::post('evaluation', 'EvaluationController@store');

});
