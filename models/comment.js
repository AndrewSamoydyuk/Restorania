var mongoose = require('mongoose'),
	Schema=mongoose.Schema;

mongoose.Promise = global.Promise;

var schema = new Schema({	
		nameFrom:{
			type : String,
			default: "anonymous"
		},
		text:{
			type : String
		},
		restName:{
			type : String
		},
		date:{ 
			type: Date, 
			default: Date.now 
		}
	});

exports.comment = mongoose.model('coment',schema);