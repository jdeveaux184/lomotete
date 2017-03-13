FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var User = require('../dto/user')
var jwt = require('jsonwebtoken');
var secret = "neidousabufirizabalza";
// var token;


  module.exports = function (app, passport) {
	  app.use(passport.initialize());
	  app.use(passport.session());
		 app.use(session({
		  secret: 'keyboard cat',
		  resave: false,
		  saveUninitialized: true,
		  cookie: { secure: false }
		}))

	  passport.serializeUser(function(user, done) {
	  		token = jwt.sign({
											email: user.email,
											admin: true
										}, secret, {expiresIn:'24h'})
		  done(null, user.id);
		});

		passport.deserializeUser(function(id, done) {
		  User.findById(id, function(err, user) {
		    done(err, user);
		  });
		});

  	passport.use(new FacebookStrategy({
	    clientID: "173570429816689",
	    clientSecret: "2e25d381fc213d5d876f13ed008b71f6",
	    callbackURL: "http://localhost:8080/auth/facebook/callback",
	    profileFields: ['id', 'email', 'name']
	  },
	  function(accessToken, refreshToken, profile, done) {
	    // User.findOrCreate(..., function(err, user) {
	    //   if (err) { return done(err); }
	    //   done(null, user);
	    // });
	    console.log("---->" + profile._json.email)

	    User.findOne({email: profile._json.email}).select("username password email").exec(function (err, user) {
	    	if (err) done (err);

	    	console.log(user);
	    	if (user && user != null) {
	    		done(null, user)
	    		
	    	} else {
	    		done(err);
	    	}
	    })
	    // done(null, profile)
	  }
	));

	// app.get('/auth/facebook', passport.authenticate('facebook'));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', {failureRedirect: '/FacebookError' }), function (req, res) {
	  	//res.json({success:true, message:"Loggeado con Facebook Satisfactoriamente", token: token})
	  	res.redirect('/#/facebook/'+token)
	  });

	app.get('/auth/facebook',
	  passport.authenticate('facebook', { scope: 'email' })
	);

  	return passport;
  }