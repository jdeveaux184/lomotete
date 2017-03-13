angular.module('loginServices',[])
	.factory('AuthToken', function ($window) {
		var authToken = {};

		authToken.setToken = function (token) {
			$window.localStorage.setItem('token', token);
		}

		authToken.getToken = function () {
			return $window.localStorage.getItem('token');
		}

		authToken.isLoggedIn = function () {
			if (authToken.getToken ()) {
				return true
			} else {
				return false
			};
		}

		authToken.logout = function () {
			$window.localStorage.removeItem('token');
		}

		authToken.facebook = function (token) {
			console.log(token)
			authToken.setToken(token);
		}

		return authToken;
	})