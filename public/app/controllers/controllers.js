angular.module("loMoteteApp")
	.controller("MainController", function ($scope) {
	})	
	.controller("Main", function ($scope, $rootScope) {
		$rootScope.sidebar = true;
		$rootScope.administrador =false;

	})
	.controller("Navigation", function ($scope, $rootScope) {

		$scope.hideSideBar = function () {
			$rootScope.sidebar = false;
		};

		$scope.showSideBar = function () {
			$rootScope.sidebar = true;
		};

	})
	.controller("Profesionales", function ($scope, $http) {
		
		$scope.perfiles = [];
		$http.get("/api/perfiles")
			.success(function(data, status, header, config) {
				$scope.perfiles = data;
			})
			.error(function(data, status, header, config) {
				return data;
			})
			;

			console.log()
			
		
	})
	
	.controller("NewFile", function ($scope) {
		$scope.tiposArchivos = ["Tazas","Regalos", "Mensajes", "Famosos"];
		console.log($scope.title);
		 
	})
	.controller("Pedidos", function ($scope, $http) {
		
		$scope.cambiarEstatus = function (estatus, index) {
						console.log(estatus, index)
						$scope.pedidos[index].estatus = estatus;
			}

		

		$scope.getOrders = function () {
			var config = {
				params : {}
			};

			if ($scope.delivery) {
			config.params.delivery = $scope.delivery;
			}

			if ($scope.flash) {
				config.params.flash = $scope.flash;
			}

			if ($scope.estatus) {
				config.params.estatus = $scope.estatus.trim();
				console.log($scope.estatus)
				console.log(config.params.estatus)
			}

			if ($scope.fechaDesde) {
				config.params.createdDate = {$gt:
				 $scope.fechaDesde};
			}

			if ($scope.fechaHasta) {
				config.params.createdDate = {$lt: $scope.fechaHasta};
			}

			if ($scope.nombre) {
				config.params.nombres = /$scope.nombre/i;
			}

			console.log(config)
			

			console.log($scope.estatus)
	 
			$scope.pedidos = [];
			console.log(config)
			$http.get("/api/pedidos", config)
				.success(function(data, status, header, config) {
					console.log(config)
					$scope.pedidos = data;
					$scope.listaEstatus = ["Pendiente","En Proceso", "Enviado a Impresión", "Pendiente Entrega", "Entregado", "Devuelto"];

					

					console.log($scope.listaEstatus);
				})
				.error(function(data, status, header, config) {
					return data;
				})
				;
			}
 
		$scope.pedidos = [];
		$http.get("/api/pedidos")
			.success(function(data, status, header, config) {
				$scope.pedidos = data;
				$scope.listaEstatus = ["Pendiente","En Proceso", "Enviado a Impresión", "Pendiente Entrega", "Entregado", "Devuelto"];
				console.log($scope.listaEstatus);
			})
			.error(function(data, status, header, config) {
				return data;
			})
			;
		
	})
	.controller("Admin", function ($scope, $http) {
	})
	.controller("Contacto", function ($scope) {

	})
	.controller("EditProduct", function ($scope, $http, $routeParams) {
		
		$scope.random = 32423423423;
		$scope.product = {};
		$http.get("/api/menu/edit/"+$routeParams.id)
			.success(function(data, status, header, config) {
				$scope.product = data;
				$scope.title = angular.copy($scope.product.title);
				$scope.description = angular.copy($scope.product.description);
				$scope.price = angular.copy($scope.product.price);
				$scope.imagen_producto = angular.copy($scope.product.url);

			})
			.error(function(data, status, header, config) {
				return data;
			})
			;

			console.log($scope);

			$scope.actualizar = function () {
				var data = {
					//_id: $scope.product._id,
					title: $scope.title,
					description: $scope.description,
					price: $scope.price
				};
				console.log($scope)

				$http.put("/api/menu/"+$routeParams.id,data)
					.success (function(data, status, config, header) {
						console.log(data)
						return data;

					})
					.error (function(data, status, config, header) {
						console.log(data)
						return data;
					})

			}
	})
	.controller("EditFile", function ($scope, $http, $routeParams) {
		
		$scope.random = 32423423423;
		$scope.product = {};
		$http.get("/api/menu/edit/"+$routeParams.id)
			.success(function(data, status, header, config) {
				$scope.product = data;
				$scope.title = angular.copy($scope.product.title);
				$scope.categoria = angular.copy($scope.product.categoria);
				$scope.imagen_producto = angular.copy($scope.product.url);
				$scope.createdBy = "Antonio Baez";
				$scope.createdDate = Date.now();

			})
			.error(function(data, status, header, config) {
				return data;
			})
			;

			console.log($scope);

			$scope.actualizar = function () {
				var data = {
					//_id: $scope.product._id,
					title: $scope.title,
					categoria: $scope.categoria,
					createdBy: $scope.createdBy,
					createdDate: $scope.createdDate
				};
				console.log($scope)

				$http.put("/api/files/"+$routeParams.id,data)
					.success (function(data, status, config, header) {
						console.log(data)
						return data;

					})
					.error (function(data, status, config, header) {
						console.log(data)
						return data;
					})

			}
	})
	.controller("NewProduct", function ($scope) {

	})
	.controller("ProductList", function ($scope, $http) {
		
		$scope.products = [];
		$http.get("/api/productos")
			.success(function(data, status, header, config) {
				$scope.products = data;
			})
			.error(function(data, status, header, config) {
				return data;
			})
			;
			
		
	})
	.controller("FileList", function ($scope, $http) {
		$scope.productsByCategory = [];

		$scope.products = [];
		$http.get("/api/archivos")
			.success(function(data, status, header, config) {
				$scope.products = data;
				for (var i=0; i< $scope.products.length;i++) {
					var exists = false;
					for (var j=0; j< $scope.productsByCategory.length;j++) {
						if ($scope.products[i].type === $scope.productsByCategory[j].type ) {
							$scope.productsByCategory[j].products.push($scope.products[i]);
							exists = true;
							console.log(i, j, $scope.productsByCategory[j].type, $scope.products[i])
						}
					}

					if (!exists) {
						var type = {
							type: $scope.products[i].type,
							products: []
						}
						type.products.push($scope.products[i])
						$scope.productsByCategory.push(type);
					}
					console.log($scope.productsByCategory)
				}
			})
			.error(function(data, status, header, config) {
				return data;
			})
			;


			
		
	})
	.directive('tooltip', function () {
	    return {
	        restrict:'A',
	        link: function(scope, element, attrs)
	        {
	            $(element)
	                .attr('title',scope.$eval(attrs.tooltip))
	                .tooltip({placement: "right"});
	        }
	    }
	})
.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                    var value = {
                       // File Name 
                        name: item.name,
                        //File Size 
                        size: item.size,
                        //File URL to view 
                        url: URL.createObjectURL(item),
                        // File Input Value 
                        _file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);