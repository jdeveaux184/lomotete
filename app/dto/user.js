var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSquema = new Schema({
	username:String,// {type:String, lowercase:true, required:true, unique:true},
	password: String,//{type:String, required:true},
	email:String,//{type:String, required:true, lowercase:true}
	nombres:String,
	telefono:Number
})

userSquema.pre('validate', function (next) {
	var user = this;
	bcrypt.hash(user.password, null, null, function (err, hash) {
		if (err) return next(err);
		user.password = hash;
		next();
		
	})
	next();
})

userSquema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSquema);