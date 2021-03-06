var mongoose = require('mongoose'),
	Schema=mongoose.Schema;

mongoose.Promise = global.Promise;

var schema = new Schema({
		tableNumber :{
			type: String
		},	
		availableFirst:{
			type :String
		},
		clientNameFirst:{
			type : String
		},
		availableSecond:{
			type :String
		},
		clientNameSecond:{
			type : String
		},
		availableThird:{
			type :String
		},
		clientNameThird:{
			type : String
		},
		restName:{
			type:String
		},
		numberOfSeats :{
			type : String
		}
	});

exports.table = mongoose.model('table',schema);