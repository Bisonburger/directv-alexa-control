'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var ENDPOINT = process.env.URL + '/tv/getProgramInfo?major=';

function WhatsOn() { }

WhatsOn.prototype.requestWhatsOn = function(channel) {
  return this.getProgrammingInfo(channel).then(
    function(response) {
      console.log('success - received programming info for ' + channel);
      return response.body;
    }
  );
};

WhatsOn.prototype.getProgrammingInfo = function(channel) {
  var options = {
    method: 'GET',
    uri: ENDPOINT + channel,
    resolveWithFullResponse: true,
    json: true,
    proxy: 'http://tus-proxy.ext.ray.com'
  };
  if( process.env.HTTP_PROXY )
    options.proxy = process.env.HTTP_PROXY;
  return rp(options);
};

WhatsOn.prototype.formatAirportStatus = function(programmingInfo) {

    var template = _.template('Right now on ${callsign}, ${title} is playing');
    return template({
      callsign: programmingInfo.callsign,
      title: programmingInfo.title
    });
};

module.exports = WhatsOn;
