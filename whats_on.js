var _ = require('lodash');
var rp = require('request-promise');
var channelMap = require('./channel-map.js');

function WhatsOn() {}


WhatsOn.prototype.getCurrentChannel = function() {
  return RESTHelper('/tv/getTuned').then(function(res){
    console.log( 'got a result - looking for the proper name for ' + res.major );
    res.channelName = findNameForChannel(res.major);
    if( res.channelName ) console.log( 'found the name for ' + res.major + ', its ' + res.channelName );
    return res;
  });
};

WhatsOn.prototype.getProgrammingInfo = function(channel) {
  var me = this;

  if (isChannelName(channel)){
    channel = findChannelForName(channel);
    console.log( 'channel was a name so I converted it to ' + channel );
  }

  if (_.isArray(channel)) {
    console.log( 'channel was an array - I\'ll try to process that' );
    var a = [];
    channel.forEach(function(c, i) {a.push(me.getProgrammingInfo(c).then(function(r) {a[i] = r;}));});
    return a;
  }
  else{
    return RESTHelper('/tv/getProgInfo?major=' + channel ).then(
      function(res) {
        console.log( 'got a result - looking for the proper name for ' + channel );
        res.channelName = findNameForChannel(channel);
        if( res.channelName ) console.log( 'found the name for ' + channel + ', its ' + res.channelName );
        return res;
      });
  }
};

WhatsOn.prototype.formatProgrammingStatus = function(programmingInfo) {
  var me = this;
  if (_.isArray(programmingInfo)) {
    var info = [];
    programmingInfo.forEach(
      function(programming){
        info.push(me.formatProgrammingStatus(programming));
      });
    return info.join('\n');
  }
  else {
    
    var templateString = programmingInfo.episodeTitle? '${title}, ${episodeTitle}, is on ${callsign}' : '${title} is on ${callsign}';
    var template = _.template(templateString);
    return template({
      callsign: programmingInfo.channelName || ('channel ' + programmingInfo.major),
      title: programmingInfo.title,
      channel: programmingInfo.major,
      episodeTitle: programmingInfo.episodeTitle || ''
    });
  }
};

WhatsOn.prototype.tuneToChannel = function(channel) {
  if (isChannelName(channel)){
    channel = findChannelForName(channel);
    console.log( 'channel was a name so I converted it to ' + channel );
  }
  return RESTHelper('/tv/tune?major=' + channel ).then(
      function(res) {
        console.log( 'got a result - looking for the proper name for ' + channel );
        res.channelName = findNameForChannel(channel);
        if( res.channelName ) console.log( 'found the name for ' + channel + ', its ' + res.channelName );
        return res;
      });
};

function RESTHelper(uri){
  console.log( 'calling ' + process.env.DIRECTV_URL + uri );
  return rp({
    method: 'GET',
    uri: process.env.DIRECTV_URL + uri,
    resolveWithFullResponse: false,
    json: true
  });
}

function findChannelForName(name){
  return name? channelMap[Object.keys(channelMap).find( function(e){ return e.toUpperCase() === name.toUpperCase() } )] : undefined;
}

function findNameForChannel(channel){
  return Object.keys(channelMap).find( function(e){ return channelMap[e] === channel } );
}

function isChannelName(channel){
  return channel && isNaN(parseInt(channel, 10));
}

module.exports = WhatsOn;
