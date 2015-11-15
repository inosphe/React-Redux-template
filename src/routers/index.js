'use strict'

module.exports = function(app){
	app.get('/:a?', function(req, res){
		res.renderIndex();
	});

	// app.use('/v1', require('./api-v1/api-router-v1')(app));
}
