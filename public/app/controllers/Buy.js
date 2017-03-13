angular.module('loMoteteApp')
	.controller("Buy", function ($scope, $http, $location, $timeout) {
			$scope.products = [
			];
			$scope.selectedProducts = [];
			$scope.montoRecargo = 0;
			$scope.montoTotal =0;
			$scope.subTotal =0;
			$scope.totalDescuento =0;

			$http.get("/api/productos")
				.success(function(data, status, header, config) {
					$scope.products = data;
					console.log($scope.products)
				})
				.error(function(data, status, header, config) {
					return data;
				})
				;

			// initialize with defaults
			// $("#input-id").fileinput();
			 
			// with plugin options
			// $("#input-id").fileinput({'showUpload':false, 'previewFileType':'any'});

			$scope.fillSelectedProducts = function () {
				for (var i =  $scope.products.length - 1; i >= 0; i--) {
					$scope.products[i].estatus = "Pendiente";
					 if ($scope.products[i].productSelected) {
					 	$scope.selectedProducts.push($scope.products[i]);
					 }
				}
			}
			$scope.recalcular = function () {
				$scope.montoTotal = 0;
				for (var i =  $scope.products.length - 1; i >= 0; i--) {
					 if ($scope.products[i].cantidad > 0) {
					 	$scope.montoTotal += $scope.products[i].cantidad*$scope.products[i].price;
					 	$scope.subTotal += $scope.products[i].cantidad*$scope.products[i].price-$scope.products[i].discount;
					 	$scope.totalDescuento += $scope.products[i].discount;
					 } 
				}
			}



			$scope.addProduct = function (index) {
					 if ($scope.products[index].productSelected) {
					 	$scope.selectedProducts.push($scope.products[index]);
					 }
			}

			$scope.agregarCargo = function (tipo, cargo) {
				console.log($scope.delivery, $scope.flash, $scope.montoTotal, $scope.montoRecargo)
				if (tipo === "D") {
					if ($scope.delivery) {
						$scope.montoRecargo += cargo;
					}
					else {
						$scope.montoRecargo -= cargo;
					}
				}
				else {
					if ($scope.flash) {
						$scope.montoRecargo += cargo;
					}
					else {
						$scope.montoRecargo -= cargo;
					}
				}
			}

			$scope.agregarArchivo = function (parentIndex, file) {
				$scope.products[parentIndex].archivos = $scope.products[parentIndex].archivos ? $scope.products[parentIndex].archivos : [];
				console.log(parentIndex);
				console.log($scope.products[parentIndex])
				$scope.products[parentIndex].archivos.push(file)
			}

			$scope.setInitialValues = function (index) {
				if ($scope.products[index].productSelected) {
					// if (!$scope.products[index].cantidad) {
						$scope.products[index].cantidad = 1;
						$scope.products[index].discount = 0;
					// }
				}
				else
				{
					$scope.products[index].cantidad = 0;
					$scope.products[index].discount = 0;
				}

				$scope.recalcular();
			}


			$scope.submit = function () {
				url = "/api/pedido";
				$scope.selectedProducts = [];
				$scope.fillSelectedProducts ();
				$scope.errorMessage = null
				$scope.successMessage = null;

				data = {
					nombres : $scope.nombres,
					email : $scope.email,
					telefono: $scope.telefono,
					products: $scope.selectedProducts,
					delivery: $scope.delivery,
					flash: $scope.flash,
					comentarios: $scope.comentarios,
					estatus: "Pendiente",
					fechaCreacion:Date.now(),
					fechaEntrega: Date.now()+5,
					direccion: $scope.direccion || null
				};

				$http.post(url, data).then(function(data) {
					if (data.data.success) {
						$scope.successMessage = data.data.message;
							$timeout(function() {
							$location.path('/#/anuncio/index');
							
						},2000)
					} else {
						$scope.errorMessage = data.data.message;
					}
				})
	//             .success(function (data, status, headers, config) {
	// 				console.log("Success");
	//             })
	//             .error(function (data, status, header, config) {
	// 				console.log("error");
	//             });
			}
			 
		})