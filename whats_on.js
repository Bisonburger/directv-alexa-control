'use strict';
var _ = require('lodash');
var rp = require('request-promise');
//var Promise = require('bluebird');

var ENDPOINT = process.env.DIRECTV_URL + '/tv/getProgInfo?major=';

function WhatsOn() {
  this.channelMap = require('./channel-map.js');
}

WhatsOn.prototype.getCurrentChannel = function() {
  var options = {
    method: 'GET',
    uri: process.env.DIRECTV_URL + '/tv/getTuned',
    resolveWithFullResponse: false,
    json: true
  };
  return rp(options).then(function(res) {
    return res;
  });
};

WhatsOn.prototype.getProgrammingInfo = function(channel) {
  var me = this;

  var isName = channel && isNaN(parseInt(channel, 10));
  var name = channel;
  if (isName)
    channel = this.channelMap[channel];
  var options = {
    method: 'GET',
    uri: process.env.DIRECTV_URL + '/tv/getProgInfo?major=' + channel,
    resolveWithFullResponse: false,
    json: true
  };

  if (_.isArray(channel)) {
    var a = [];
    channel.forEach(function(c, i) {
      a.push(me.getProgrammingInfo(c).then(function(r) {
        a[i] = r;
      }));
    });
    return a;
  }
  else
    return rp(options).then(function(res) {
      if (isName) res.channelName = name;
      return res;
    });
};

WhatsOn.prototype.formatProgrammingStatus = function(programmingInfo) {
  var me = this;
  if (_.isArray(programmingInfo)) {
    var info = [];
    programmingInfo.forEach(function(programming) {
      info.push(me.formatProgrammingStatus(programming));
    });
    return info.join('\n');
  }
  else {

    
    var templateString = (programmingInfo.episodeTitle) ? '${title}, ${episodeTitle}, is on ${callsign}' : '${title} is on ${callsign}';

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
  var options = {
    method: 'GET',
    uri: process.env.DIRECTV_URL + '/tv/tune?major=' + channel,
    resolveWithFullResponse: false,
    json: true
  };

  return rp(options);
};

module.exports = WhatsOn;
