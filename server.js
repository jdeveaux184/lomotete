var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var upload = multer();
var port = process.env.PORT || 8080;
var router = express.Router();
var cloudinary = require("cloudinary");
var usr_admin = "123456";
var fs = require("fs");

var passport = require('passport');
var social = require('./app/passport/passport')(app,passport);

cloudinary.config({
	cloud_name:"dpx0v2ycy",
	api_key: "548987244541267",
	api_secret: "H5hxSlo17SHPJjFe1AonLjYDTWI"

})


var userApi = require('./app/api/user')(router);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
var upload = multer({ dest: 'uploads/' });

app.use(express.static(__dirname+'/public'));
app.use('/api', userApi);



mongoose.connect("mongodb://localhost/web_site_db", function (err) {
	if (err) {
		console.log("Error al conectarse a la base de datos: " + err);
	} else {
		console.log("Conectado a la base de datos satisfactoriamente");
	}
});

var squema = {
	nombres:String,
	email:String,
	telefono:Number,
	products:Array,
	delivery:Boolean,
	flash:Boolean,
	comentarios:String,
	estatus:String,
	fechaCreacion:Date,
	fechaEntrega:Date,
	direccion: String
};

var perfilSquema = {
	nombres: String,
	apellidos: String,
	cedula: String,
	fechaNacimiento: String,
	sexo: String,
	correo: String,
	direccion: String,
	ciudad: String,
	estadoCivil: String,
	foto: String,
	formacionData: Array,
	experienciaData: Array,
	formacionCData: Array,
	competenciasData: Array,
	referenciasData: Array
};

var productSquema = {
	title:String,
	description:String,
	url:String,
	price:Number
};

var fileSquema = {
	title:String,
	url:String,
	type:String,
	createdBy:String,
	createdDate:Date
};

var noticiaSquema = {
	title:String,
	noticia:String,
	url:String,
	createdBy:String,
	createdDate:Date,
	link:String
};

var Product = mongoose.model("Product",productSquema);
var Anuncio = mongoose.model("Anuncio",squema);
var Perfil = mongoose.model("Perfil", perfilSquema);

var Pedido = mongoose.model("Pedido",squema);
var File = mongoose.model("Archivo",fileSquema);
var Noticia = mongoose.model("Noticia",noticiaSquema);

app.get("/api/productos",  function(req,res) {
	Product.find(function(err, document) {
		res.json(document);
	});
});

app.get("/api/archivos",  function(req,res) {
	File.find(function(err, document) {
		res.json(document);
	});
});

app.post("/api/menu" , upload.single("imagen_producto"), function (req,res) {
	
	var data = {
		title: req.body.title,
		description: req.body.description,
		url: "data.png",
		price: req.body.price
	}

	
	

	var product = new Product (data);

	cloudinary.uploader.upload(req.file.path, function(result) { 
		
		product.url = result.url;
  		product.save (function(err) {
			res.json({});
		})
	});
	/*
	product.save (function(err) {
		console.log(product);
		res.render("index");
	})
	*/
});

app.post("/api/files" ,  upload.single("archivo_carga"), function (req,res) {

	var data = {
		title: req.body.title,
		url: "data.png",
		type: req.body.type//,
		//createdBy: req.body.createdBy,
		//createdDate: req.body.createdDate
	}

	var file = new File (data);

	cloudinary.uploader.upload(req.file.path, function(result) { 
		
		file.url = result.url;
	// 	console.log(result);
  		file.save (function(err) {
			res.json({});
		})
	});
	/*
	product.save (function(err) {
		console.log(product);
		res.render("index");
	})
	*/
});

app.post("/api/new" ,  upload.single("newFile"), function (req,res) {

	var data = {
		title  : req.body.title,
		noticia: req.body.noticia,
		url: "data.png",
		createdBy: "Lomo TT",
		createdDate: Date.now(), 
		link: req.body.link
	};

	console.log("------>", req.file)

		var noticia = new Noticia (data);
		
		cloudinary.uploader.upload(req.file ? req.file.path : data.url, function(result) { 
		
			noticia.url = result.url;
			console.log(result);
			noticia.save (function(err) {
				res.redirect("/");
			})
	  		
		});

	/*
	product.save (function(err) {
		console.log(product);
		res.render("index");
	})
	*/
});

app.get("/api/pedidos", function(req,res) {
	Pedido.find(req.query, function(err, document) {
		res.json(document);
	});
});

app.get("/api/news",  function(req,res) {
	Noticia.find(function(err, document) {
		
		res.json(document);

	});
});

app.get("/api/perfiles",  function(req,res) {
	Perfil.find(function(err, document) {
		res.json(document);
	});
});



app.get("/api/menu/edit/:id",  function(req,res) {
	Product.findOne({"_id": req.params.id}, function(err, document) {
		res.json(document);
	});
});

app.get("/api/files/edit/:id",  function(req,res) {
	File.findOne({"_id": req.params.id}, function(err, document) {
		res.json(document);
	});
});

app.post("/api/admin", function(req, res) {

		res.redirect("/");
});

app.post("/api/pedido" , function (req,res) {
	var data = {
		nombres: req.body.nombres,
		email: req.body.email,
		telefono: req.body.telefono,
		products: req.body.products,
		delivery: req.body.delivery,
		flash: req.body.flash,
		comentarios:  req.body.comentarios,
		estatus: req.body.estatus,
		fechaCreacion: req.body.fechaCreacion,
		fechaEntrega: req.body.fechaEntrega,
		direccion: req.body.direccion
	}
	
	var pedido = new Pedido (data);

	if (!req.body.nombres||!req.body.email||!req.body.telefono||!req.body.products) {
		res.json({success:false, message:"Faltan datos por Completar"});
	}
	else {
	  	pedido.save (function(err) {
	  		if (err) {
	  			res.json({success:false, message:"Error al Guardar la Orden de Compra"})
	  		} else {
				res.json({success:true, message:"Orden de Compra Realizado"});
	  			
	  		}
			})
	}
	/*
	product.save (function(err) {
		console.log(product);
		res.render("index");
	})
	*/
})	;

app.get("/", function(req,res){
	res.sendFile(__dirname + "/index.html");
})

app.post("/api/perfil" , function (req,res) {
	var data = {
				nombres: req.body.nombres,
				apellidos: req.body.apellidos,
				cedula: req.body.cedula,
				fechaNacimiento: req.body.fechaNacimiento,
				sexo: req.body.sexo,
				correo: req.body.correo,
				direccion: req.body.direccion,
				ciudad: req.body.ciudad,
				estadoCivil: req.body.estadoCivil,
				foto: req.body.foto,
				formacionData: req.body.formacionData,
				experienciaData: req.body.experienciaData,
				formacionCData: req.body.formacionCData,
				competenciasData: req.body.competenciasData,
				referenciasData: req.body.referenciasData
	}
	
	var perfil = new Perfil (data);

  	perfil.save (function(err) {
		res.json({});
		})
	/*
	product.save (function(err) {
		console.log(product);
		res.render("index");
	})
	*/
})

app.delete("/api/anuncio/:id", function (req, res) {
	Anuncio.remove({_id: req.params.id}, function (err) {
		if (err) {
			console.log("Error al Borrar");
		}
		else
		{
			console.log("Borrado Exitosamente	")
		}
	})
})

app.put ("/api/menu/:id",function (req, res) {
	var data = {
		title: req.body.title,
		description: req.body.description,
		price: req.body.price
	};

	Product.update({"_id":req.params.id}, data, function () {
		res.redirect("/menu");
	})


});

app.put("/api/menu" , function (req,res) {
	
	var data = {
		title: req.body.title,
		description: req.body.description,
		price: req.body.price
	}
	

	var product = new Product (data);

	product.save (function(err) {
		res.end();
	})
	/*
	product.save (function(err) {
		console.log(product);
		res.render("index");
	})
	*/
})

app.put ("/api/files/:id",function (req, res) {
	var data = {
		title: req.body.title,
		url: "data.png",
		type: req.body.type,
		createdBy: req.body.createdBy,
		createdDate: req.body.createdDate
	}

	File.update({"_id":req.params.id}, data, function () {
		res.json({});
	})


});

app.put ("/api/pedidos/:id",function (req, res) {
var data = {
		nombres: req.body.nombres,
		email: req.body.email,
		telefono: req.body.telefono,
		products: req.body.products,
		delivery: req.body.delivery,
		flash: req.body.flash,
		comentarios:  req.body.comentarios,
		estatus: req.body.estatus,
		fechaCreacion: req.body.fechaCreacion,
		fechaEntrega: req.body.fechaEntrega,
		direccion: req.body.direccion
	}

	Pedido.update({"_id":req.params.id}, data, function () {
		res.json({});
	})


});

app.put("/api/files" , function (req,res) {
	
	var data = {
		title: req.body.title,
		url: "data.png",
		type: req.body.type//,
		// createdBy: req.body.createdBy,
		// createdDate: req.body.createdDate
	}
	

	var file = new File (data);

	file.save (function(err) {
		res.end();
	})
	/*
	product.save (function(err) {
		console.log(product);
		res.render("index");
	})
	*/
})

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'))
})

app.listen (port, function () {
	console.log("Servidor corriendo en el puerto: "+ port)
})