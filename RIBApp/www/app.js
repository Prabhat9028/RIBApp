var app = angular.module("index", ['ui.router','ngCookies','angular-loading-bar', 'ngAnimate', 'toastr']);

app.config(function($stateProvider, $urlRouterProvider){
	
	$stateProvider.state('login',{
		url:'/login',
		templateUrl: 'login.html',
		controller: 'loginCtrl',
		data:{
			title: "Login"
		}
						 
	}).state('signup',{
		url:'/signup',
		templateUrl: 'register.html',
		controller: 'registerUser',
		data:{
			title: "Signup"
		}
		
	}).state('registervehicle',{
		url:'/registervehicle',
		templateUrl: 'registervehicle.html',
		controller: 'registerVehicle',
		data:{
			title: "RegisterVehicle"
		}
		
	}).state('home',{
		url:'/home',
		templateUrl: 'home.html',
		controller: 'homeCtrl',
		data:{
			title: "home"
		}
		
	});
	
	$urlRouterProvider.otherwise('login');
	
});

app.constant('serverUrl', 'http://carsecure.herokuapp.com');
