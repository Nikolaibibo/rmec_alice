var Twitter = require('twitter');
var pfio = require('piface-node');

pfio.init();

var credentials = require('./credentials_alice.json');

var client = new Twitter({
  consumer_key: credentials.twitter_consumer_key,
  consumer_secret: credentials.twitter_consumer_secret,
  access_token_key: credentials.twitter_access_token_key,
  access_token_secret: credentials.twitter_access_token_secret
});

// var for not sending too much sms - by now with bad setTimeout
// TODO: change for performance
var isPowered = false;
var waittime = 10000;
var pumpTime = 1400;

// hastag/searchterm for API
//var searchTerm = "#Alice,#aufschrei,#bushido,#heidiklum,#likeagirl,#pornographie,#empörungsgesellschaft,#porno,#heidiklum";
//var searchTerm = "#Sascha,#nsa,#angelamerkel,#dasinternetistkaputt,#habenichtszuverbergen,#lassunsreden";
var searchTerm = "forkrulez"

function powerUp () {
  console.log("power up");
  isPowered = true;
  pfio.digital_write(0,1);
}

function powerDown () {
  console.log("power down");
  //isPowered = false;
  pfio.digital_write(0,0);
  setTimeout(doReset, 5000);
}

function doReset () {
  isPowered = false;
}

// start reading stream
function startStream (conn) {

  console.log("LASS DIE HELDEN HEULEN - #alice");
	console.log("searching for hashtags: " + searchTerm);

 	client.stream('statuses/filter', {track:searchTerm}, function(stream) {
    		stream.on('data', function(tweet) {
      			console.log("@" + tweet.user.screen_name + " :::: " + tweet.text + "  ::::  " + tweet.created_at);
      			//var tweetObject = {text:tweet.text, user:tweet.user.screen_name, time:tweet.created_at, location:tweet.user.location, userpic:tweet.user.profile_image_url};
            if (!isPowered) powerUp();
            setTimeout(powerDown, pumpTime);
		});

		stream.on('error', function(error) {
      //sendAlertNotification();
      // sendSMS("nodejs server error!");
      powerDown();
      throw error;
  		});
	});
}


// go
startStream();
