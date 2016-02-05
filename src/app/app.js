var express = require('express');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var promiseMapSeries = require('promise-map-series');

Object.defineProperty(global, 'logger', {
	value: console
	, configurable: false
	, enumerable: true
})

function readJson(filename){
	return JSON.parse(require('fs').readFileSync(filename, "utf8"));
}


module.exports = function(opt){
	var app = new express();
	opt = opt || {};
	opt.rootdir = opt.rootdir || __dirname;
	_.extend(app, opt);
	app.helper = {};

	app.config = getConfig('config.json');

	app.init = function(){
		logger.log('* initializing ...');
		return promiseMapSeries(['init', 'routers'], initFile)
		.then(()=>logger.log('* init_comlete'))
	}

	app.start = function(){
		var port = app.config.port || 3000;

		return this.init()
		.then(function(){
			app.listen(port);
			_.each(app.tests, func=>func());
			logger.log('*** server is running on', port);
		});
	}

	return app;

	function initFile(file){
		var initialized = {};

		function __initFolder(folder){
			var dir = path.resolve(app.rootdir + '/src', folder);
			var promises = []
			fs.readdirSync(dir).forEach(function(file){
				if(file.search(/.*?\.js$/) != -1){
					promises.push(__initFile(dir + '/' + file));
				}
			})
			return Q.all(promises);
		}

		function __initFile(file){
			var file = path.resolve(app.rootdir, file);
			if(initialized[path.basename(file)]){
				console.warn('! duplicated - ', path.basename(file));
				return;
			}
			var mod = require(file);
			if(typeof mod == 'function'){
				ret = mod(app);
				initialized[path.basename(file)] = true;

				logger.log(file, 'initialized.');
				return ret;
			}
			else{
				logger.warn(file , 'is not function.');
			}
		}

		if(path.extname(file) == ''){
			return __initFolder(file);
		}
		else{
			return __initFile(file);
		}
	}
}
