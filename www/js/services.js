angular.module('starter.services', ['ionic', 'starter.constants'])

.service('AuthService', function($q, $http, USER_ROLES){
	var LOCAL_TOKEN_KEY = 'yourTokenKey'
	var username = '';
	var isAuthenticated = false;
	var role = '';
	var authToken;

	function loadUserCredentials(){
		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
   		if (token) {
			useCredentials(token);
		} 
	}

	function storeUserCredentials(token){
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		useCredentials(token);
	}

	function useCredentials(token){
		username = token.split('.')[0];
		isAuthenticated = true;
		authToken = token;

		if (username == 'admin'){
			role = USER_ROLES.admin;
		}
		if (username == 'user'){
			role = USER_ROLES.public;
		}

		$http.defaults.headers.common['X-AUTH-TOKEN'] = token;
	}

	function destroyUserCredentials(){
		authToken = undefined;
		username = '';
		isAuthenticated = false;
		$http.defaults.headers.common['X-AUTH-TOKEN'] = undefined;
		window.localStorage.removeItem(LOCAL_TOKEN_KEY);

	}

	var login = function(name, pw){
		return $q(function(resolve, reject){
			if((name == 'admin' && pw =='1')||(name=='user' &&pw=='1')){
				storeUserCredentials(name+'.yourServerToken');
				resolve('Login Success');
			}
			else {
				reject('Login Failed');
			}
		});
	}

	var logout = function(){
		destroyUserCredentials();
	}

	var isAuthorized = function(authorizedRoles){
		if(angular.isArray(authorizedRoles)){
			authorizedRoles = [authorizedRoles];
		}

		return (isAuthenticated && authorizedRoles.indexOf(role) !==-1);
	}

	loadUserCredentials();

	return {
		login : login,
		logout : logout,
		isAuthorized : isAuthorized,
		isAuthenticated : function (){return isAuthenticated;},
		username : function(){return username;},
		role: function(){return role;}
	};
})

//requests with invalid tokens will be automatically rejected
//interceptor will notice response errors n $http and broadcast a message
.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS){
	return {
		responseError : function(response){
			$rootScope.$broadcast({
				401: AUTH_EVENTS.notAuthenticated,
				403: AUTH_EVENTS.notAuthorized
			}[response.status], response);
			return $q.reject(response);
		}
	};
})

//push authinterceptor so it gets registered for all requests made
.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
});