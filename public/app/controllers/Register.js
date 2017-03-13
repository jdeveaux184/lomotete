angular.module('loMoteteApp')
	.controller('regData', function ($scope, $http, $location, $rootScope, $timeout) {
		$scope.register = function () {
			console.log($scope.info)
			$scope.errorMessage = null;
			$scope.successMessage = null;
			$scope.cargando = true;
			if ($scope.info && $scope.info.password === $scope.info.passConfirm) {
				$http.post('/api/users', $scope.info).then(function(data) {
					if (data.data.success) {
						$scope.successMessage = data.data.message;
						$scope.cargando = false;
						$timeout(function () {
							$location.path ('/#/anuncio/index');
						},2000)
						$rootScope.user = $scope.info.username;
						
					} else {
						$scope.errorMessage = data.data.message;
						$scope.cargando = false;
					}
				})
			} else {
				$scope.errorMessage = "Las Constraseñas digitadas no coinciden";
				$scope.cargando = false;
			}
		}
	})