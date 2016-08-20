var passport = require('passport');

var User = require('./models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
	passport.serializeUser(function(user,done) {
		console.log('serilize');
		done(null,user._id);
	});
	passport.deserializeUser(function(id,done) {
		console.log('deserilize');
		User.findById(id,function(err,user) {
			console.log(user);
			done(err,user);
		});
	});
	passport.use('login',new LocalStrategy(
		function(username,password,done) {
			User.findOne({username:username},function(err,user) {
				if(err) {
					return done(err);
				}
				if(!user) {
					return done(null,false,
						{message:"no user has that username"});
				}
				if(password !== user.password ) {//validPassword需要自定义
					return done(null,false,
						{message:'invalid password'});
				} 
				return done(null,user);
			});
		}));
};

