var express = require('express');
var router = express.Router();
var async = require('async');
var	bodyParser = require('body-parser');
var sendMess = require('../sendEmail/sendEmail');
var listOfRest = require('../models/listOfRest').listOfRest;
var maps = require('../models/map').map;
var User = require('../models/user').User;
var BookOfSuggestion= require('../models/bookOfSuggestion').BookOfSuggestion;
var mongoose = require('../libs/mongoose');


router.get('/', function(req, res) {
  	listOfRest.find( function(err , restaurants){
		res.render('index.ejs',{rest : restaurants } );
	});
});

router.post('/', function(req, res) {
	async.parallel([
		function(callback){
		  	var params = {
			  from: 'myrestorania@gmail.com', 
			  to: 'andrij5310@ukr.net', 
			  subject: "От "+req.body.name,
			  text: req.body.message
			};
			sendMess.transport.sendMail(params, function (err, res) {
				callback(err, res);
			});
		},
		function(callback){
			var record = new BookOfSuggestion({
				name : req.body.name,
				message : req.body.message
			});
			record.save( function(err, record){
				callback(err, record);
			});
		}
		], function(err,results){
			res.redirect('/');
	});
});

router.get('/addRest',function(req,res){
	if (req.user) {
		res.render('addRest.ejs');
	}else{
		res.send(403);
	}
})

router.post('/addRest', function(req,res){
	var rest = new listOfRest({
		name:req.body.name,
		rate:req.body.rate,
		workTime: req.body.workTime,
		averageCheck: req.body.averageCheck,
		food: req.body.food,
		imgUrl: req.body.imgUrl
	});
	var map = new maps({
		name:req.body.name,
		x:req.body.x,
		y:req.body.y
	});
	map.save(function(err,map){
		if(err) throw err;
	});
	rest.save(function(err,rest){
		if(err) throw err;
	});
	res.redirect('/');
});

router.get("/rests/:name", function(req,res){
	async.parallel([
		function(callback){
			listOfRest.findOne({name:req.params.name},function(err , onerest){
				var oneRest=onerest;
				callback(err,oneRest);
			});
		},
		function(callback){
			maps.findOne({name:req.params.name}, function(err,coor){
				var Coor=coor;
				callback(err,Coor);
			});
		}
		], function(err,results){
			res.render('concreteRest.ejs', {rest: results[0] , coor: results[1]});
		});
});
router.post("/login" , function(req,res){
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({username:username}, function(err,user){
		if(user){
			if (user.checkPassword(password)) {
				// 200 OK
				req.session.user = user._id;
				res.redirect('/')
			}else{
				// 403 
				res.send(403);
			}
		}else{
			// Here can be registration
			res.send(403);
		}
	});
});
router.post("/logout" , function(req,res){
   req.session.destroy();
   res.redirect('/');
});

module.exports = router;