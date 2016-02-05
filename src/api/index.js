'use strict'

let express = require('express');

module.exports = function(app){
	let router = express.Router();

	router.use(require('./v1')(app));

	return router;
}