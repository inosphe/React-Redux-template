var express = require('express');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var Q = require('q');

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


	init(['init', 'routers']);

	app.config = getConfig('config.json');

	app.init = function(){
		return Q();
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

	function init(files){
		logger.log('* initializing ...');
		var initialized = {};

		var promises = [];

		_.each(files, function(file){
			var p = __init(file);
			if(p){
				promises.push(p);
			}
		});

		logger.log('* init_comlete');

		function __init(file){
			if(path.extname(file) == ''){
				__initFolder(file);
			}
			else{
				return __initFile(file);
			}
		}

		function __initFolder(folder){
			var dir = path.resolve(app.rootdir + '/src', folder);
			fs.readdirSync(dir).forEach(function(file){
				if(file.search(/.*?\.js$/) != -1){
					__initFile(dir + '/' + file);
				}
			})
		}

		function __initFile(file){
			logger.log('__initFile', file);
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

			}
			else{
				logger.warn(file , 'is not function.');
			}
		}
	}
}
