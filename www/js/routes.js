angular.module('starter.routes',['ionic', 'starter.constants'])

.config(function($stateProvider, $urlRouterProvider,USER_ROLES){
	
	$urlRouterProvider.otherwise(function($injector, $location){
		var $state = $injector.get('$state')
		$state.go('main.dash');
	});

	$stateProvider
		.state('login', {
			url : '/login',
			templateUrl : 'templates/login.html',
			controller : 'LoginCtrl'
		})

		.state('main',{
			url : '/',
			templateUrl : 'templates/main.html'
		})

		.state('main.dash', {
			url: 'main/dash',
			views : {
				'dash-tab' : {
					templateUrl : 'templates/dashboard.html',
					controller : 'DashCtrl'
				}

			}
		})

		.state('main.public', {
			url: 'main/public',
			views : {
				'public-tab' : {
					templateUrl: 'templates/public.html',
				}
			}
		})

		.state('main.admin', {
			url : 'main/admin',
			views : {
				'admin-tab' : {
					templateUrl : 'templates/admin.html'
				}
			},
			data : {
				authorizedRoles : [USER_ROLES.admin]
			}
		});
})



