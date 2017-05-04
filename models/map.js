var mongoose = require('mongoose'),
	Schema=mongoose.Schema;

mongoose.Promise = global.Promise;

var schema = new Schema({	
		name:{
			type:String
		},
		x:{
			type:String
		},
		y:{
			type:String
		}
	});

exports.map = mongoose.model('map',schema);