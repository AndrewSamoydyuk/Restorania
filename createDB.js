var mongoose = require('./libs/mongoose');
var async = require('async');

async.series([
	open,
	drop,
	requireModels,
	create
	], function(err,results){
		console.log(arguments);
		mongoose.disconnect();
	});

function open(callback){
	mongoose.connection.on('open', callback);
};
function drop(callback){
	var db = mongoose.connection.db;
	db.dropDatabase(callback);
};
function requireModels(callback){
		require('./models/user');

		async.each(Object.keys(mongoose.models), function(modelName, callback){
			mongoose.models[modelName].ensureIndexes(callback);
		}, callback);
};

function create(callback){
	var users = [
		{username:"user1",email:"user1@gmail.com",password: "pass"},
		{username:"user2",email:"user2@gmail.com",password: "pass"},
		{username:"user3",email:"user3@gmail.com",password: "pass"}
	];
	async.each(users , function(userData, callback){
		var user = new mongoose.models.User(userData);
		user.save(callback);
	},callback );
	};
