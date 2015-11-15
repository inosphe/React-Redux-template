global.__base = __dirname;
global.getConfig = function(name){
	return require(__dirname + '/config/' + name);
}

var app = require('./src/app/app')({
	rootdir: __dirname
});

app.start();
