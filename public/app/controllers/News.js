angular.module('loMoteteApp')
	.controller("News", function ($scope, $rootScope, $http, AuthToken, $location) {
		$scope.news = [];
		console.log("Noticias")
		$scope.loaded = false;
		$scope.posts = [];

		$scope.post = {};

		$scope.isActivado = function (tab) {
		$scope.tab = {
			'uno': '',
			'dos': '',
			'tres': ''
		};
		$scope.tab[tab] = 'active';

		}
		$scope.isActivado('uno');
		$scope.imgStyle = "background-image: url('https://i.ytimg.com/vi_webp/7grF9GgHwCw/hqdefault.webp');"

		

		$scope.save = function () {
			console.log($scope.post)

			$http.post("/api/new",$scope.post).then(function (data) {
				$location.path("/#/")
			})
			;
		}

		$scope.Agregar = function () {
			console.log($scope.post)
			$scope.posts.push($scope.post);
			console.log($scope.posts)
			$scope.post = {}
			
		}

		var data = {
			need2bLogged:false
		}

		$http.get("/api/news",data)	
			.success(function(data, status, header, config) {
				$scope.news = data;
				console.log($scope.news)
			})
			.error(function(data, status, header, config) {
				return data;
			})
			;

		$scope.loaded = true;

	})