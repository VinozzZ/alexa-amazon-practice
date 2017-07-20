'use strict';

module.change_code = 1;

var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('airportinfo');

var FAADataHelper = require('./faa_data_helper');

// This method will be automatically triggered any time the skill is invoked, and it requires a response to be sent to the user.
app.launch(function(req, res){
	var prompt = 'For delay information, tell me an Airport code.';
	// 'shouldEndSession', the key determining factor as to whether your skill will continue listening for user interaction, or close the skill completely. 
	res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('airportinfo', {
		'slots': {
			'AIRPORTCODE': 'FAACODES'
		},
		'utterances':['{|flight|airport}{|delay|status}{|info}{|for}{-|AIRPORTCODE}']
	},
		function(req,res){
			var airportCode = req.slot('AIRPORTCODE');
			var reprompt = 'Tell me an airport code to get delay information.';
			if(_.isEmpty(airportCode)){
				var prompt = 'I didn\'t hear an airport code. Tell me an airport code.';
				res.say(prompt).reprompt(reprompt).shouldEndSession(false);
				return true;
			}else{
				var faaHelper = new FAADataHelper();
				faaHelper.requestAirportStatus(airportCode).then(function(airportStatus){
					console.log(airportStatus);
					res.say(faaHelper.formatAirportStatus(airportStatus)).send();
				}).catch(function(err){
					console.log(err);
					var prompt = ' I didn\'t have data for an airport code of ' + airportCode;
					console.log(prompt);
					res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
				});
				return false;
			}
		}
);
module.exports = app;