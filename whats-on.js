/**
 * Alexa/Echo skill for controlling DirecTV
 * 
 * @module whats-on
 * @license ISC    
 * @copyright 2017, BISONWORKS, LLC
 */
var _ = require('lodash'),
  rp = require('request-promise'),
  channelMap = require('./channel-map.js');

/**
 * Constructor for the WhatsOn object
 */
function WhatsOn() {}

/**
 * Retrieve programming information for the currently tuned channel
 * 
 * @return {Object} programming information
 */ 
WhatsOn.prototype.getCurrentChannel = function(location) {
  return RESTHelper('/tv/getTuned',{'clientAddr':findClientAddrForLocation(location)}).then(function(res){
    res.channelName = findNameForChannel(res.major);
    return res;
  });
};

/**
 * Retrieve programming information for the supplied channel
 * 
 * @param {String|Number} channel - channel identifier (string or num) to request information from
 * @return {Object} programming information
 */
WhatsOn.prototype.getProgrammingInfo = function(channel,location) {
  var me = this;

  if (isChannelName(channel)){
    channel = findChannelForName(channel);
    //console.log( 'channel was a name so I converted it to ' + channel );
  }

  if (_.isArray(channel)) {
    //console.log( 'channel was an array - I\'ll try to process that' );
    var a = [];
    channel.forEach(function(c, i) {a.push(me.getProgrammingInfo(c).then(function(r) {a[i] = r;}));});
    return a;
  }
  else{
    return RESTHelper('/tv/getProgInfo', { 'major': channel, 'clientAddr': findClientAddrForLocation(location) } ).then(
      function(res) {
        //console.log( 'got a result - looking for the proper name for ' + channel );
        res.channelName = findNameForChannel(channel);
        //if( res.channelName ) console.log( 'found the name for ' + channel + ', its ' + res.channelName );
        return res;
      });
  }
};

/**
 * Format the programming information to SSML response
 * 
 * @param {Object|Array} programmingInfo
 * @return {String|Array} formated message(s)
 */
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
    
    var templateString = programmingInfo.episodeTitle? '${title}, ${episodeTitle}, is on ${callsign}' : '${title} is on ${callsign}',
      template = _.template(templateString);
    return template({
      callsign: programmingInfo.channelName || ('channel ' + programmingInfo.major),
      title: programmingInfo.title,
      channel: programmingInfo.major,
      episodeTitle: programmingInfo.episodeTitle || ''
    });
  }
};

/**
 * Tune the receiver to a given channel number/name
 * 
 * @param {String|Number} channel
 * @return {Object} channel tune status
 */
WhatsOn.prototype.tuneToChannel = function(channel,location) {
  if (isChannelName(channel)){
    channel = findChannelForName(channel);
    //console.log( 'channel was a name so I converted it to ' + channel );
  }
  return RESTHelper('/tv/tune', { 'major': channel, 'clientAddr':findClientAddrForLocation(location) }).then(
      function(res) {
        //console.log( 'got a result - looking for the proper name for ' + channel );
        res.channelName = findNameForChannel(channel);
        //if( res.channelName ) console.log( 'found the name for ' + channel + ', its ' + res.channelName );
        return res;
      });
};

/**
 * Helper function to send a REST call to the receiver
 * 
 * @param {String} uri - receiver command to to sent
 * @return {Object} recieved response - body only
 */
function RESTHelper(uri,qs){
  //console.log( 'calling ' + process.env.DIRECTV_URL + uri );
  return rp({
    method: 'GET',
    baseUrl: (process.env.DIRECTV_URL || 'http://localhost:8080'),
    uri: uri,
    qs: qs,
    resolveWithFullResponse: false,
    json: true,
    simple: true
  });
}

/**
 * Lookup a channel for a given name
 * 
 * @param {String} channel name
 * @return {Number} channel number corresponding to the name; undefined if not found
 */
function findChannelForName(name){
  return name? channelMap[Object.keys(channelMap).find( function(e){ return e.toUpperCase() === name.toUpperCase() } )] : undefined;
}

/**
 * Lookup a name for a given channel number.  Will return the first one found if multiples are in the list
 * 
 * @param {Number} channel number
 * @return {String} channel name corresponding to the channel number; undefined if not found
 */
function findNameForChannel(channel){
  return Object.keys(channelMap).find( function(e){ return channelMap[e] === channel } );
}

/**
 * Determine if the value is a channel name.  Currently determined by 
 * trying to convert the input value to a number - if this fails, its considered a name
 * 
 * @param {Object} channel potential channel name
 * @return {Boolean} true if the channel represents a channel name, false otherwise
 */
function isChannelName(channel){
  return channel && isNaN(parseInt(channel, 10));
}

function findClientAddrForLocation(location){
  if( location.toLowerCase() === 'bedroom' || location.toLowerCase() === 'master' )
    return '2832C5A7D138';
  else return '0';
}

module.exports = WhatsOn;
