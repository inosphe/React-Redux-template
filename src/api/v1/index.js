'use strict'

let routerUtil = require('util/routerUtil');

module.exports = function(app){
	return routerUtil.initRouter(__dirname, app);
}