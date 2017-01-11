var restify = require('restify');
var mongoose = require('mongoose');
var config = require('./config/config');

//
var server = restify.createServer({});

// Plugins
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
server.pre(restify.pre.sanitizePath());

// Database connection
mongoose.connect(config.mongodb)

server.on('uncaughtException', function (req, res, route, err) {
	console.error('uncaughtException: %s', err.stack)
	res.send(new restify.InternalError('An unexpected error occurred'))
})

// Routes
require('./routes')(server, restify)

server.listen(config.serverPort, function () {
	console.log('%s listening at %s', server.name, server.url)
})
