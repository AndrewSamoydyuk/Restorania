var mongoose = require ('mongoose');

mongoose.connect("mongodb://localhost/restaurants", {"server":{"socketOptions":{"keepAlive":1}}});
module.exports = mongoose;