angular.module('starter.controllers', ['ionic', 'starter.routes', 'starter.services', 'starter.constants'])

.controller('AppCtrl', function($scope,$state, $ionicPopup , AuthService, AUTH_EVENTS){
	$scope.username = AuthService.username();

	$scope.$on(AUTH_EVENTS.notAuthorized, function(event){
		var alertPopup = $ionicPopup.alert({
			title: 'Unauthorized!',
			template: 'You are not allowed to access this resource'
		});
	});

	$scope.$on(AUTH_EVENTS.notAuthenticated, function(event){
		AuthService.logout();
		$state.go('login');

		var alertPopup = $ionicPopup.alert({
			title : 'Session Lost',
			template : 'Sorry, Please log in again.'
		});
	});

	$scope.setCurrentUsername = function(name){
		$scope.username = name;
	};
})

.controller('LoginCtrl', function($scope, $state, AuthService, $ionicPopup){
	$scope.data = {};

	$scope.login  = function(data){
		AuthService.login(data.username, data.password)
			.then(function(authenticated){
				$state.go('main.dash', {}, {reload: true});
				$scope.setCurrentUsername(data.username);
			}, function(err){
				var alertPopup = $ionicPopup.alert({
					title : 'login failed',
					template : 'Please check your credentials'
				});
			});
	};
})

.controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService){
	$state.logout = function(){
		AuthService.logout();
		$state.go('login');
	};

	$state.performValidRequest = function(){
		$http.get('http://localhost:8101/valid')
			.then(function(result){
				$scope.response = result;
		});
	};

	$state.performUnauthorizedRequest =function(){
		$http.get('http://localhost:8101/unauthorized')
			.then(function(result){

			}, function(err){
				$scope.response = err;
			});
	};

	$state.performInvalidRequest = function(){
		$http.get('http://localhost:8101/notauthenticated')
			.then(function(result){

			}, function(err){
				$scope.response = err;
			});
	};


});