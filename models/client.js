var mongoose = require('mongoose'),
	Schema=mongoose.Schema;

mongoose.Promise = global.Promise;

var schema = new Schema({	
		name:{
			type:String
		},
		phoneNumber:{
			type:String
		},
		tableIdentification:{
			type:String
		}
	});

exports.client = mongoose.model('client',schema);