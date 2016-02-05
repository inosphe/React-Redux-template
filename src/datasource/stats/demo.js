'use strict'

let _request = require('./_request');

module.exports = function(){
	return _request('basketball', 'nba', 'events');
}