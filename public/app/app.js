angular.module("loMoteteApp",["ngRoute","ngResource","ui.bootstrap","ngAnimate","loginServices"])
	.config(function($routeProvider) {
		$routeProvider
			.when("/",{
				controller: "News",
				templateUrl: "app/views/news.html"
			})
			.when("/register", {
				controller: "regData",
				templateUrl: "app/views/register.html"
			}).when("/anuncio/new", {
				controller: "Buy",
				templateUrl: "app/views/anuncio/new.html"
			})
			.when ("/anuncio/index", {
				controller: "Pedidos",
				templateUrl: "app/views/anuncio/index.html"
			})
			.when("/menu/new", {
				controller: "NewProduct",
				templateUrl: "app/views/menu/new.html"
			})
			.when ("/menu/index", {
				controller: "ProductList",
				templateUrl: "app/views/menu/index.html"
			})	
			.when("/files/new", {
				controller: "NewFile",
				templateUrl: "app/views/files/new.html"
			})
			.when ("/files/index", {
				controller: "FileList",
				templateUrl: "app/views/files/index.html"
			})	
			.when("/profesional/new", {
				controller: "NewProfile",
				templateUrl: "app/views/profesional/new.html"
			})
			.when ("/profesional/index", {
				controller: "Profesionales",
				templateUrl: "app/views/profesional/index.html"
			})
			.when("/contacto", {
				controller: "Contacto",
				templateUrl: "app/views/contacto.html"
			})
			.when("/admin", {
				controller: "Admin",
				templateUrl:"app/views/admin.html"
			})
			.when("/menu/edit/:id", {
				controller: "EditProduct",
				templateUrl:"app/views/menu/edit.html"
			})
			.when("/files/edit/:id", {
				controller: "EditFile",
				templateUrl:"app/views/files/edit.html"
			})
			.when("/news", {
				controller: "News",
				templateUrl:"app/views/news.html"
			})
			.when("/facebook/:token", {
				controller: "Facebook",
				templateUrl: "app/views/facebook.html"
			})
			.otherwise({redirectTo: '/'})
})
	