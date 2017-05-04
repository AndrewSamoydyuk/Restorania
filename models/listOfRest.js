var mongoose = require('mongoose'),
	Schema=mongoose.Schema;

mongoose.Promise = global.Promise;

var schema = new Schema({	
		name:{
			type:String
		},
		rate:{
			type:String
		},
		workTime:{
			type:String
		},
		averageCheck:{
			type:String
		},
		food:{
			type:String
		},
		imgUrl:{
			type:String
		}
	});

exports.listOfRest = mongoose.model('listOfRest',schema);
