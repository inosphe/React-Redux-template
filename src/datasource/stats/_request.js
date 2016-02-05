'use strict'

let authKeys = getConfig('stats');
let moment = require('moment');
let crypto = require('crypto');
let request = require('request')
let Q = require('q');

const host = 'api.stats.com/v1';
const version = 'v1';

function getKey(leagueAbbreviation){
	return authKeys[leagueAbbreviation] || authKeys["default"];
}

module.exports = function(sportName, leagueAbbreviation, resource){
	let key = getKey(leagueAbbreviation);
 	let timeFromEpoch = moment.utc().unix();
 	let sig = crypto.createHash('sha256').update(key.apiKey + key.secret + timeFromEpoch).digest('hex');

 	let defer = Q.defer();
 	const url = `http://${host}/stats/${sportName}/${leagueAbbreviation}/${resource}/?accept=json&api_key=${key.apiKey}&sig=${sig}`;
 	logger.log(url);

 	request(url, function(err, response, body){
		if(err){
			console.log(err);
			defer.reject(err);
		}
		else{
			console.log('response', response.statusCode);
			console.log(body);
			if(response.statusCode < 400)
				defer.resolve(JSON.parse(body));
			else{
				defer.reject(body);
			}
		}
	});
 	return defer.promise;
};