var mongoose = require('mongoose')
var Schema = mongoose.Schema

var sessionSchema = new Schema({
	user_id: {type: Schema.Types.ObjectId, required: true},
	token: {type: String, required: true},
	expire: {type: Date, expires: 21600}
})

module.exports = mongoose.model('session', sessionSchema)
