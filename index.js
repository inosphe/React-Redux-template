global.__base = __dirname;
global.__src = __dirname + '/src';

global.getConfig = function(name){
	return require(__dirname + '/config/' + name);
}

require('app-module-path').addPath(__src);

var app = require('./src/app/app')({
	rootdir: __dirname
});

app.start();
