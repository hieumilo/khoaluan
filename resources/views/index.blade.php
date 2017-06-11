<!DOCTYPE html>
<html lang="en" ng-app="App">
<head>
	<meta charset="UTF-8">
	<title ng-bind="$state.current.data.pageTitle"></title>

	{{-- <base href="/"> --}}

	<link href="{{ asset('angular/public/node_modules/bootstrap/dist/css/bootstrap.min.css') }}" rel="stylesheet">

	{{-- <link href="{{ asset('angular/public/node_modules/font-awesome-4.7.0/css/font-awesome.min.css') }}" rel="stylesheet"> --}}
	
	<!-- Font Awesome -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
	<!-- Ionicons -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
	<!-- Theme style -->
	<link rel="stylesheet" href="{{ asset('angular/public/css/AdminLTE.min.css') }}">
	<!-- AdminLTE Skins. Choose a skin from the css/skins
	   folder instead of downloading all of them to reduce the load. -->
	<link rel="stylesheet" href="{{ asset('angular/public/css/skins/_all-skins.min.css') }}">

	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->

	{{-- <style>
		.content-wrapper {
			min-height: 600px;
		}
	</style> --}}
	<link rel="stylesheet" href="{{ asset('angular/public/css/style.css') }}">
	

</head>
<body ng-class="$state.current.data.bodyClass">
	
	<div ui-view="layout"></div>

	<!-- jquery v2.2.3 -->
	<script src="{{ asset('angular/public/plugins/jQuery/jquery-2.2.3.min.js') }}"></script>

	<!-- Bootstrap v3.3. -->
	<script src="{{ asset('angular/public/node_modules/bootstrap/dist/js/bootstrap.min.js') }}"></script>

	<!-- AdminLTE App -->
	<script src="{{ asset('angular/public/js/app.min.js') }}"></script>
	<!-- AdminLTE for demo purposes -->
	<script src="{{ asset('angular/public/js/demo.js') }}"></script>

	<!-- admin -->
	<script src="{{ asset('angular/public/js/essential-plugins.js') }}"></script>
	<script src="{{ asset('angular/public/js/pace.min.js') }}"></script>
	<script src="{{ asset('angular/public/js/main.js') }}"></script>

	<!-- jquery.dataTables -->
	<script src="{{ asset('angular/public/plugins/datatables/media/js/jquery.dataTables.min.js') }}"></script>
	<!-- AngularJS v1.5.9 -->
	<script src="{{ asset('angular/public/node_modules/angular/angular.js') }}"></script>

	<!-- AngularCSS -->
    <script src="{{ asset('angular/public/node_modules/angular-css/angular-css.min.js') }}"></script>
	
	<!-- dataTables.bootstrap -->
	<script src="{{ asset('angular/public/plugins/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js') }}"></script>
	<!-- angular-ui-router v0.3.2 -->
	<script src="{{ asset('angular/public/node_modules/angular-ui-router/release/angular-ui-router.min.js') }}"></script>
	<!-- satellizer -->
	<script src="{{ asset('angular/public/node_modules/satellizer/dist/satellizer.js') }}"></script>
	<!-- checklist-model -->
	<script src="{{ asset('angular/public/plugins/Checklist-model/Checklist-model.js') }}"></script>
	<!-- angular-datatables -->
	<script src="{{ asset('angular/public/plugins/angular-datatables/dist/angular-datatables.min.js') }}"></script>
	<!-- angular-loading-bar -->
	<script src="{{ asset('angular/public/node_modules/angular-loading-bar/build/loading-bar.min.js') }}"></script>
	<!-- toastr -->
	<script src="{{ asset('angular/public/node_modules/angular-toastr/dist/angular-toastr.tpls.js') }}"></script>
	<!-- angular cookies -->
	<script src="{{ asset('angular/public/js/angular-cookies.js') }}"></script>
	<!-- angular file upload -->
	<script src="{{ asset('angular/public/node_modules/angular-file-upload/dist/angular-file-upload.min.js') }}"></script>

	<!-- angular script -->
	<script src="{{ asset('angular/app.js') }}"></script>

	<!-- directive -->
	<script src="{{ asset('angular/directive/dropZone.js') }}"></script>
	<script src="{{ asset('angular/directive/ng-thum.js') }}"></script>
	<script src="{{ asset('angular/directive/starRating.js') }}"></script>

	<!-- service -->
	<script src="{{ asset('angular/services/API.js') }}"></script>
	<script src="{{ asset('angular/services/auth.js') }}"></script>
	<script src="{{ asset('angular/services/Location.js') }}"></script>
	<script src="{{ asset('angular/services/GeoLocationService.js') }}"></script>

	<!-- controller -->
	<!-- admin -->
	<!-- dashboard -->
	<script src="{{ asset('angular/app/controllers/admin/dashboard.js') }}"></script>
	<!-- profile -->
	<script src="{{ asset('angular/app/controllers/admin/profile.js') }}"></script>
	<!-- auth -->
	<script src="{{ asset('angular/app/controllers/auth/register.js') }}"></script>
	<script src="{{ asset('angular/app/controllers/auth/login.js') }}"></script>
	<script src="{{ asset('angular/app/controllers/auth/logout.js') }}"></script>
	<!-- navbar -->
	<script src="{{ asset('angular/app/controllers/admin/NavbarCtrl.js') }}"></script>
	<!-- location -->
	<script src="{{ asset('angular/app/controllers/admin/location/LocationCtrl.js') }}"></script>
	<script src="{{ asset('angular/app/controllers/admin/location/list-restaurant.js') }}"></script>
	<!-- user -->
	<script src="{{ asset('angular/app/controllers/admin/user/list.js') }}"></script>
	<script src="{{ asset('angular/app/controllers/admin/user/edit.js') }}"></script>
	<!-- category -->
	<script src="{{ asset('angular/app/controllers/admin/category/list.js') }}"></script>
	<script src="{{ asset('angular/app/controllers/admin/category/create.js') }}"></script>
	<script src="{{ asset('angular/app/controllers/admin/category/edit.js') }}"></script>
	<!-- restaurant -->
	<script src="{{ asset('angular/app/controllers/admin/restaurant/list.js') }}"></script>
	<script src="{{ asset('angular/app/controllers/admin/restaurant/aplication-list.js') }}"></script>
	<script src="{{ asset('angular/app/controllers/admin/restaurant/edit.js') }}"></script>
	<!-- suggesstion -->
	<script src="{{ asset('angular/app/controllers/admin/suggesstion/list.js') }}"></script>
	<script src="{{ asset('angular/app/controllers/admin/suggesstion/edit.js') }}"></script>

	<!-- home -->
	<!-- user profile -->
	<script src="{{ asset('angular/app/controllers/auth/profile.js') }}"></script>
	
	<!-- user create restaurant -->
	<script src="{{ asset('angular/app/controllers/home/user/create-restaurant.js') }}"></script>
	<!-- user edit restaurant -->
	<script src="{{ asset('angular/app/controllers/home/user/edit-restaurant.js') }}"></script>
	<!-- user list restaurant foods-->
	<script src="{{ asset('angular/app/controllers/home/user/restaurant-foods.js') }}"></script>

	<!-- user create food -->
	<script src="{{ asset('angular/app/controllers/home/user/create-food.js') }}"></script>
	<!-- user edit food -->
	<script src="{{ asset('angular/app/controllers/home/user/edit-food.js') }}"></script>

	<!-- header -->
	<script src="{{ asset('angular/app/controllers/home/header.js') }}"></script>
	<!-- footer -->
	<script src="{{ asset('angular/app/controllers/home/footer.js') }}"></script>
	<!-- home page -->
	<script src="{{ asset('angular/app/controllers/home/homepage.js') }}"></script>
	<!-- category -->
	<script src="{{ asset('angular/app/controllers/home/category.js') }}"></script>
	<!-- restaurant -->
	<script src="{{ asset('angular/app/controllers/home/restaurant.js') }}"></script>
	<!-- search -->
	<script src="{{ asset('angular/app/controllers/home/search.js') }}"></script>

</body>
</html>