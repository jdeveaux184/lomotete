angular.module('loMoteteApp')
	.controller("HomeController", function ($scope, $rootScope, AuthToken, $http) {
		$scope.loadedMain = false;
		console.log("Loaded False")
		$rootScope.$on('$routeChangeStart', function () {
			var token = AuthToken.getToken();
			console.log(AuthToken.getToken());

			if (AuthToken.isLoggedIn ()) {
			$http.post('/api/data', {token: token}).then(function (data) {
				if (data.data.success) {
					$rootScope.user = data.data.data.email;
					$rootScope.administrador = data.data.data.admin;
				} 
			})
			

		};

		$scope.loadedMain = true;
			console.log("Loaded True")
		});

		

		


		$scope.login = function () {
			$rootScope.logg = true;
		}

		$scope.logout = function () {
			AuthToken.logout();
			$rootScope.logg = true;
			$rootScope.user = null;
			$rootScope.administrador = false;
		}
	})	