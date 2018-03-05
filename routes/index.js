var express = require('express');
var router = express.Router();
var http = require('https');
var cheerio = require('cheerio');

var responseJSON = {
  "version": "1.0",
  "sessionAttributes": {},
  "response": {
    "outputSpeech": {
      "type": "SSML",
      "ssml": "<speak>Whoops, I wasn\'t able to contact github!</speak>"
    }
  }
}

router.get('/', function(req, res, next) {
	checkGithub(req, res, next);
});

router.post('/', function(req, res, next) {
	checkGithub(req, res, next);
});

function checkGithub(req, res, next){
	http.get({
		host: 'status.github.com',
		port: 443,
		path: '/messages'
	}, function(resp){
		resp.on('data', function(chunk){
			var $ = cheerio.load(chunk);
			var lastStatus = $('#message-list').attr("data-last-known-status");
			responseJSON.response.outputSpeech.ssml="<speak>last status according to status.github.com was "+lastStatus+"</speak>"
			res.send(responseJSON);
		});
	}).on("error", function(e){
		res.send(responseJSON);
		console.log("Got error: " + e.message);
	});
}

module.exports = router;
