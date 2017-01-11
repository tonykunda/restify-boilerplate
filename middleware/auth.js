var session = require('../models/session')
var user = require('../models/user')
module.exports = function(server, restify) {
	return function (req, res, next) {
    session.findOne({token:req.headers.token}, function(err, sessionFound){
			if (!sessionFound) {
				next(new restify.NotAuthorizedError('This resource requires authentication'))
			} else {
				user.findOne({_id:sessionFound.user_id}, function(err, user){
					// Add the user data to the request object
					req.userData = user
					// Refresh the session
					session.remove({token: sessionFound.token}, function(err){
						console.log(err)
						var expireDate = new Date()
						expireDate.setHours(expireDate.getHours()+4)
						sessionEntry = new session({user_id:sessionFound.user_id, token:sessionFound.token, expire: expireDate})
						sessionEntry.save()
						next()
					})
				})
			}
    })
	}
}
