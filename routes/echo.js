module.exports = function(server, restify){
	var requireAuth = require('../middleware/auth')(server, restify)
	server.get('/', requireAuth, function (req, res, next) {
		res.send({hello:"world", user:req.userData})
		return next()
	})
}
