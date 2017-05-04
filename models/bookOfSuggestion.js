var mongoose = require('mongoose'),
	Schema=mongoose.Schema;

mongoose.Promise = global.Promise;

var schema = new Schema({	
		name:{
			type : String
		},
		message:{
			type : String
		},
		date:{ 
			type: Date, 
			default: Date.now 
		}
	});

exports.BookOfSuggestion = mongoose.model('BookOfSuggestion',schema);