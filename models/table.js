var mongoose = require('mongoose'),
	Schema=mongoose.Schema;

mongoose.Promise = global.Promise;

var schema = new Schema({	
		available:{
			type: Boolean
		},
		restName:{
			type:String
		},
		clientName:{
			type:String
		},
		numberOfSeats :{
			type : String
		},
		code : {
			type : String
		}
	});

exports.Table = mongoose.model('table',schema);