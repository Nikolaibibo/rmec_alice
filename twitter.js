// requires for twitter and piface modules
var Twitter = require('twitter');
var pfio = require('piface-node');

// initializing the piface
pfio.init();

// loads the twitter API secrets that are excluded
var credentials = require('./credentials_alice.json');

// sets up the twitter client
var client = new Twitter({
  consumer_key: credentials.twitter_consumer_key,
  consumer_secret: credentials.twitter_consumer_secret,
  access_token_key: credentials.twitter_access_token_key,
  access_token_secret: credentials.twitter_access_token_secret
});

// control vars for status, wait time and pump time
var isPowered = false;
var waittime = 10000;
var pumpTime = 2200;

// hastag/searchterm for API
//var searchTerm = "#Alice,#aufschrei,#bushido,#heidiklum,#likeagirl,#pornographie,#empörungsgesellschaft,#porno,#heidiklum";
//var searchTerm = "#Sascha,#nsa,#angelamerkel,#dasinternetistkaputt,#habenichtszuverbergen,#lassunsreden";
var searchTerm = "forkrulez, forkrules, heuldoch";

// powers up the pump by switching the relay
function powerUp () {
  console.log("power up");
  isPowered = true;
  pfio.digital_write(0,1);
}

// powers down the pump by switching the relay
function powerDown () {
  console.log("power down");
  //isPowered = false;
  pfio.digital_write(0,0);
  setTimeout(doReset, 5000);
}

// resets the status
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

            //if (!isPowered) startBlinking();
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
