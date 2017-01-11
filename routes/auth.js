var NodePbkdf2 = require('node-pbkdf2')
var uuid = require('uuid/v1')
var hasher = new NodePbkdf2({ iterations: 10000, saltLength: 12, derivedKeyLength: 30 });
var user = require('../models/user')
var session = require('../models/session')

module.exports = function(server, restify){

	// Register
	server.post('/register', function (req, res, next) {
		// Hash the password
		hasher.encryptPassword(req.body.password, function (err, encryptedPassword) {
			// Write to the DB
			userEntry = new user({email:req.body.email, active:true, password:encryptedPassword})
			userEntry.save(function(err){
				if (err) {
					res.send(err)
				} else {
					res.send({success:true})
				}
			})
			return next()
		})
	})

	// Login
	server.post('/login', function (req, res, next) {
		user.findOne({email:req.body.email}, function(err, user){
			if (err) {
				res.send(err)
			} else if (!user) {
				return next(new restify.UnauthorizedError("User Not Found"));
			} else {
				hasher.checkPassword(req.body.password, user.password, function(err, passwordValid){
					if (!passwordValid) {
						return next(new restify.UnauthorizedError("Incorrect Password"));
					} else {
						var token = uuid()
						var expireDate = new Date()
						expireDate.setHours(expireDate.getHours()+4)
						sessionEntry = new session({user_id:user, token:token, expire: expireDate})
						sessionEntry.save()
						res.send({success:true, token:token})
					}
				})
			}
		})
	})

}
