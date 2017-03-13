angular.module('loMoteteApp')
	.controller('Facebook', function ($routeParams, AuthToken, $location) {

		AuthToken.facebook($routeParams.token);
		$location.path('/');
	})