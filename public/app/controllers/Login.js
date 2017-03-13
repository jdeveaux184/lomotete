angular.module('loMoteteApp')
	.controller("Login", function ($scope, $rootScope, $http, $location, $timeout, AuthToken, $window) {
		$scope.correo = "jdeveaux@hotmail.com";
		$scope.password = "123456";
		$scope.loaded = false;
		$scope.data = {};

		$scope.login = function () {

			$scope.errorMessage = null;
			$scope.successMessage = null;
			$rootScope.user = $scope.correo;
			$scope.cargando = true;

			// var data = {
			// 	email : $scope.correo,
			// 	password: $scope.password
			// };

			console.log($scope.data)

			$http.post('/api/login', $scope.data).then(function(data) {
				console.log($scope.data)
				if (data.data.success) {
						$scope.successMessage = data.data.message;
						$scope.cargando = false;
						//$rootScope.user = $scope.info.username;
						AuthToken.setToken(data.data.token);
						$timeout(function() {
							$scope.successMessage = null;
						},2000)

						$rootScope.logg = false;
						$rootScope.administrador = true;
						

						var token = AuthToken.getToken();
						console.log(token);
					} else {
						$scope.errorMessage = data.data.message;
						$scope.loaded = true;
						$scope.cargando = false;
					}
					console.log(data.data.message)

			})
		};

		$scope.facebookLogin = function () {
			$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
		}

		if ($window.location.pathname == '/FacebookError') {
			$rootScope.logg = true;
			$scope.errorMessage = "Usuario de Facebook no Existe en la Base de Datos"
		};

		$scope.loaded = true;
		
		
	})	