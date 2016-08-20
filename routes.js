var express = require('express');
var passport = require('passport');

var User = require('./models/user');
var router = express.Router();

function ensureAuthentiacted(req,res,next) {
	if(req.isAuthenticated()) {
		next();
	} else {
		req.flash('info','you must be logged in to see this page');
		res.redirect('/login');
	}
}

router.use(function(req,res,next) {
	res.locals.currentUser = req.user;
	res.locals.errors = req.flash('error');
	res.locals.infos = req.flash('info');
	next();
});
router.get('/',function(req,res,next) {
	User.find()
		.sort({createdAt:"descending"})
		.exec(function(err,users) {
			if(err) {
				return next(err);
			}
			res.render('index',{users:users});	
		});
});
router.get('/signup',function(req,res,next) {
	res.render('signup');
});
router.post('/signup',function(req,res,next) {
	var username = req.body.username;
	var password = req.body.password;
	User.findOne({username:username},function(err,user) {
		if(err) {return next(err);}
		if(user) {
			req.flash('error','user already exists');
			return res.redirect('/signup');
		}
		var newUser = new User ({
			username:username,
			password:password
		});
		newUser.save(next);
		return res.redirect('/');
	});

});
/*
,passport.authenticate('login',{
		successRedirect:'/',
		failureRedirect:'signup',
		failureFlash:true

})
*/


//profile route
router.get('/users/:username',function(req,res,next) {
	User.findOne({username:req.params.username},function(err,user) {
		if(err) {
			return next(err);
		}
		if(!user) {
			return next(404);
		}
		res.render('profile',{user:user});
	});
});
router.get('/login',function(req,res) {
	res.render('login');
});
router.post('/login',passport.authenticate('login',{
	successRedirect:'/',
	failureRedirect:'/login',
	failureFlash:true
}));
router.get('/logout',function(req,res) {
	req.logout();
	res.redirect('/');
});

router.get('/edit',ensureAuthentiacted,function(req,res) {
	res.render('edit');
});
router.post('/edit',ensureAuthentiacted,function(req,res) {
	req.user.displayName = req.body.displayname;
	req.user.bio = req.body.bio;
	req.user.save(function(err) {
		if(err) {
			next(err);
			return;
		}
		req.flash('info','profile updated');
		res.redirect('/edit');
	});
});
module.exports = router;