var express = require('express');
var router = express.Router();
var async = require('async');
var	bodyParser = require('body-parser');
var sendMess = require('../sendEmail/sendEmail');
var listOfRest = require('../models/listOfRest').listOfRest;
var maps = require('../models/map').map;
var table = require('../models/table').table;
var clients = require('../models/client').client;
var User = require('../models/user').User;
var comment  = require('../models/comment').comment;
var BookOfSuggestion= require('../models/bookOfSuggestion').BookOfSuggestion;
var mongoose = require('../libs/mongoose');

router.get('/', function(req, res) {
  	listOfRest.find( function(err , restaurants){
		res.render('index.ejs',{rest : restaurants , found : null} );
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

router.post('/findByName', function(req, res) {
	listOfRest.find({name:req.body.restName},function(err , onerest){
		listOfRest.find( function(err , restaurants){
			res.render('index.ejs',{ rest : restaurants , found : onerest } );
		});
	});	
});

router.post('/findByCheck', function(req, res) {
	listOfRest.find( function(err , restaurants){
		var Found =[]; 
		for (var i = 0; i <restaurants.length; i++) {
			if (+restaurants[i].averageCheck > +req.body.check) {
				Found.push(restaurants[i]);
			}
		}
		listOfRest.find( function(err , restaurants){
			res.render('index.ejs',{ rest : restaurants , found : Found } );
		});
	});		
});

router.get('/addRest',function(req,res){
	if (req.user) {
		listOfRest.find( function(err , restaurants){
			res.render('addRest.ejs',{ rest : restaurants } );
		});
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

router.post('/addTable' , function(req,res){
	var tabl = new table({
		tableNumber: req.body.tableNumber,
		restName : req.body.restName,
		numberOfSeats : req.body.numberOfSeats,
		availableFirst : true,
		availableSecond : true,
		availableThird : true
	});
	tabl.save(function(err, table){
		if(err) throw err;
		res.redirect('/');
	});	
});
// router.get('/uptable' , function(req,res){
// 	table.findOne({tableNumber: "2"}, function(err,table){
// 	table.availableFirst = false;
// 	table.save(function(err, table){
// 		if(err) throw err;
// 		console.log(table);
// 	});	
// 	res.end();
// 	});
// });

router.get('/bookTable/:restName/:tableNumber/:time' , function(req,res){
	res.render('bookTable.ejs' , {restName :req.params.restName , tableNumber :req.params.tableNumber , time :  req.params.time});
});

router.get('/cancelBooking/:restName' , function(req,res){
	res.render('cancelBooking.ejs' , { restName :req.params.restName });
});

router.post('/cancelBooking/:restName' , function(req,res){
	table.find({restName:req.params.restName},function(err , tables){
		for (var i = 0; i <tables.length; i++) {
			if (tables[i].clientNameFirst===req.body.clientName) {
	 			table.update({restName : req.params.restName , clientNameFirst : req.body.clientName},
	 			{$set:{availableFirst:true}},function(err,res){
	 				if (err) throw err;
	 			})

			}else if (tables[i].clientNameSecond===req.body.clientName) {
				table.update({restName : req.params.restName , clientNameSecond : req.body.clientName},
	 			{$set:{availableSecond:true}},function(err,res){
	 				if (err) throw err;
	 			})
			}else if (tables[i].clientNameThird===req.body.clientName) {
				table.update({restName : req.params.restName , clientNameThird : req.body.clientName},
	 			{$set:{availableThird:true}},function(err,res){
	 				if (err) throw err;
	 			})
			}
		}
	});	
	 res.redirect('/#book');
});

router.post('/bookTable/:restName/:tableNumber/:time' , function(req,res){

	table.findOne({tableNumber: req.params.tableNumber , restName : req.params.restName}, function(err,table){
	if (req.params.time==="first") {
		table.availableFirst = false;
		table.clientNameFirst = req.body.clientName;
	}else if (req.params.time==="second"){
		table.availableSecond = false;
		table.clientNameSecond = req.body.clientName;
	}else if(req.params.time==="third"){
		table.availableThird = false;
		table.clientNameThird = req.body.clientName;
	}
	table.save(function(err, table){
		if(err) throw err;
	});	

	var client = new clients({
		name : req.body.clientName,
		phoneNumber : req.body.phone,
		tableIdentification:req.params.tableNumber
	});
	client.save(function(err,client){
		if(err) throw err;
	});

	});
	res.redirect('/');
});

router.post('/addComment/:restName', function(req,res ){
	async.parallel([
	function(callback){
		var com = new comment({
		nameFrom:req.body.nameFrom,
		text:req.body.text,
		restName: req.params.restName 
		});
		com.save(function(err, com){
			if(err) throw err;
			callback(err,com);
		});	
	},
	function(callback){
		listOfRest.findOne({name:req.params.restName},function(err , onerest){
			callback(err,onerest);
		});
	},
	function(callback){
		maps.findOne({name:req.params.restName}, function(err,coor){
			callback(err,coor);
		});
	},
	function(callback){
		setTimeout( function(){
			comment.find({restName:req.params.restName}, function(err , comments){
				callback(err,comments);
			})},100);

	}
	], function(err,results){
		res.redirect('/#book');
	});
});

router.get("/rests/:name/:time", function(req,res ){
	async.parallel([
		function(callback){
			listOfRest.findOne({name:req.params.name},function(err , onerest){
				callback(err,onerest);
			});
		},
		function(callback){
			maps.findOne({name:req.params.name}, function(err,coor){
				callback(err,coor);
			});
		},
		function(callback){
			comment.find({restName:req.params.name}, function(err , comments){
				callback(err,comments);
			});
		},
		function(callback){
			if (req.params.time==="first") {
				table.find({restName : req.params.name , availableFirst : true }, function(err , tables){
				callback(err, tables);
				});
			}else if (req.params.time==="second"){
				table.find({restName : req.params.name , availableSecond: true }, function(err , tables){
				callback(err, tables);
			});
			}else if(req.params.time==="third"){
				table.find({restName : req.params.name , availableThird : true }, function(err , tables){
					callback(err, tables);
				});
			}
		}
		], function(err,results){
			res.render('concreteRest.ejs', {rest: results[0] , coor: results[1] , comments :results[2] , tables : results[3] , time :req.params.time});
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