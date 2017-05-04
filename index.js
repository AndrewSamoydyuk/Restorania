var express = require('express');
var app = express();
var	bodyParser = require('body-parser');
var mainPage = require('./router/mainPage');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require("connect-mongo")(session);
var mongoose = require('./libs/mongoose');
var port = process.env.PORT || 5000;

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret : "secretKey",
	key : "sid",
	cookie : {
		"path":"/",
		"httpOnly":true,
		"maxAge":null
	},
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(require('./middleware/loadUser'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/', mainPage);


app.listen(port,function(){
	console.log("Listen on port: " + port);
});