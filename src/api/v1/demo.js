'use strict'

let express = require('express');

module.exports = function(app){
	let router = express.Router();

	router.get('/', function(req, res){
		require('datasource/stats/demo')()
		.then(results=>res.send(results))
		.fail(err=>res.status(400).send(err))
	})

	return router;
}