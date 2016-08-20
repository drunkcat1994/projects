var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var path = require('path');
var body_parser = require('body-parser');
var cookie_parser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

var routes = require('./routes');//自定义模块的引用
var setUpPassport = require('./setUpPassport');

var app = express();
console.log('1');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://LAM:767797706@ds153715.mlab.com:53715/jerrychen");//mongolab连接错误
setUpPassport();//作用？

app.set('port',process.env.PORT || 8000);

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
console.log('2');
app.use(body_parser.urlencoded({extended:false}));
app.use(cookie_parser());//引入中间件的时候都要加括号
app.use(express.static(path.join(__dirname,'public')));//写错了
app.use(session({
	secret:'secret',
	resave:true,
	saveUninitialized:true,
	cookie:{ 
		maxAge: 1000*60*30
	}
}));
//app.use()的顺序很重要
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);


app.listen(app.get('port'),function() {
	console.log("server is listening on port" + app.get('port'));
});