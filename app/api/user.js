var User = require('../dto/user');
var jwt = require('jsonwebtoken');
var secret = "neidousabufirizabalza";

module.exports = function(router) {
	router.post ('/users', function (req, res) {
		var user = new User ();

		user.password = req.body.password;
		user.email = req.body.email;
		user.nombres = req.body.nombres;
		user.apellidos = req.body.apellidos;
		user.telefono = req.body.telefono;
		user.newspaper = req.body.newspaper;
		
		if (!user.nombres || !user.email || !user.password) {
			res.json({success:false, message: "Faltan Datos por Completar"});
		} else {
			user.save(function (err) {
			if (err) {
				res.json({success:false, message: "Ya existe un usuario con este usuario o correo!"})
			} else {
				res.json ({success:true, message: "Usuario Creado"})
			}
		});
		}


	})

	router.post('/login', function (req, res) {
		User.findOne({email: req.body.email}).select('username email password nombres telefono').exec(function(err,user) {
			if (err) throw err;

			if (!user) {
				res.json({success:false, message:"Usuario Inválido"})
			} else {
				if (req.body.password) {
					var validPassword = user.comparePassword(req.body.password)
				} else {
					res.json ({success:false, message:"No ha digitado la contraseña"})
				}

				if (!validPassword) {
					res.json({success:false, message:"Contraseña Inválida"})
				} else {

					var token = jwt.sign({
											email: req.body.email,
											admin: true
										}, secret, {expiresIn:'24h'})
					res.json({success:true, message: "Usuario Autenticado", token: token})
				}
			}
		})
	});

	router.use(function (req, res, next) {
		var token = req.body.token||req.body.query||req.headers['x-access-token'];

		if (token) {
			jwt.verify(token,secret, function (err, decoded){
				if (err) {
					res.json ({success:false, message:"Token Invalido"})
				} else {
					req.decoded = decoded;
					next();
				}
			})
		} else {
			if (req.body.need2bLogged) {
				res.json({success:false,message:"Token no fue suministrado"})
			} else {
				next();
			}
		}
	})

	router.post('/data', function (req, res) {
		res.json({success:true, message: "Token Valido", data: req.decoded})
	})

	return router;
	
}