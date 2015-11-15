var express 		= require('express');
var bodyParser		= require('body-parser')
var path			= require('path');

module.exports = function(app){
	Object.defineProperty(global, '_', {
		value: require('underscore')
		, configurable: false
	})

	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json());

	app.use('/', express.static('./public/resources/nativeAssets', {index: false}));
 	app.use(function(req, res, next){
	 	res.render = render.bind(res);
	 	res.renderIndex = renderIndex.bind(res);
	 	next();
 	});

 	function render(filename){
		this.sendFile(path.resolve(app.rootdir, './public/resources/nativeAssets/' + filename));
	}

	function renderIndex(){
		this.render('index.html');
	}

	app.needAuthorization = function(req, res, next){
		if(!req.user){
			res.redirect(app.config.index);
		}
		else{
			next();
		}
	}

	app.needUnathorization = function(req, res, next){
		if(req.user){
			res.redirect(app.config.index);
		}
		else{
			next();
		}
	}
}
