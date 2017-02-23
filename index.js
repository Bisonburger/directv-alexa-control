/*
    index.js:  
    
    ISC License
    
    Copyright (c) 2017, BISONWORKS, LLC
    
    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.
    
    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
    OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
 */
module.change_code = 1;
var Alexa = require('alexa-app');
var app = new Alexa.app('DirecTV');
var WhatsOn = require('./whats_on');


/*
 * establish handler for the skill launch event
 */
app.launch( handleLaunchEvent );

/*
 * whatsOnCurrentChannelIntent - allows the user to request what is playing on
 *  the current channel
 */
app.intent('whatsOnCurrentChannelIntent', {
    'slots': {
    },
    'utterances': [
      '{what\'s|what is} {on}'
    ]
  },
  handleWhatsOnCurrentChannelRequest);

/*
 * whatsOnByNumberIntent - allows the user to request what is playing on
 *  a channel by the channel's number
 */
app.intent('whatsOnByNumberIntent', {
    'slots': {
      'CHANNEL_NUMBER': 'NUMBER'
    },
    'utterances': [
      '{what\'s|what is} on channel {-|CHANNEL_NUMBER}'
    ]
  },
  handleWhatsOnByNumberRequest);

/*
 * whatsOnByNameIntent - allows the user to request what is playing on
 *  a channel by the channel's name
 */
app.intent('whatsOnByNameIntent', {
    'slots': {
      'CHANNEL_NAME': 'CHANNELS'
    },
    'utterances': [
      '{what\'s|what is} on {-|CHANNEL_NAME}'
    ]
  },
  handleWhatsOnByNameRequest);

/*
 * changeChannelByNumberIntent - allows the user to request to change to a
 *  a channel by the channel's number
 */
app.intent('changeChannelByNumberIntent', {
    'slots': {
      'CHANNEL_NUMBER': 'NUMBER'
    },
    'utterances': [
      '{change|switch|go|tune} to channel {-|CHANNEL_NUMBER}'
    ]
  },
  handleChangeChannelByNumberRequest);
  
/*
 * changeChannelByNameIntent - allows the user to request to change to a
 *  a channel by the channel's name
 */
app.intent('changeChannelByNameIntent', {
    'slots': {
      'CHANNEL_NAME': 'CHANNELS'
    },
    'utterances': [
      '{change|switch|go|tune} to {-|CHANNEL_NAME}'
    ]
  },
  handleChangeChannelByNameRequest);
  
/**
 * Handle requests to launch the skill
 * 
 * @param {Object} req request object
 * @param {Object} res response object
 */

function handleLaunchEvent(req, res) {
  var prompt = 'For programming information, tell me a channel number or name';
  res.say(prompt).reprompt('Tell me a channel').shouldEndSession(false);
}
  
/**
 * Handle requests to the whatsOnCurrentChannel intent
 * 
 * @param {Object} req request object
 * @param {Object} res response object
 */
function handleWhatsOnCurrentChannelRequest(req,res){
  var whatsOn = new WhatsOn();

  return whatsOn.getCurrentChannel().then(function(programInfo) {
    res.say(whatsOn.formatProgrammingStatus(programInfo)).send();
  });
}

/**
 * Handle requests to the whatsOnByNumber intent
 * 
 * @param {Object} req request object
 * @param {Object} res response object
 */
function handleWhatsOnByNumberRequest(req, res) {
  var channelNumber = req.slot('CHANNEL_NUMBER');

  var whatsOn = new WhatsOn();

  return whatsOn.getProgrammingInfo(channelNumber).then(function(programInfo) {
    res.say(whatsOn.formatProgrammingStatus(programInfo)).send();
  });
}

/**
 * Handle requests to the whatsOnByName intent
 * 
 * @param {Object} req request object
 * @param {Object} res response object
 */
function handleWhatsOnByNameRequest(req, res) {
  var channelName = req.slot('CHANNEL_NAME');
  var whatsOn = new WhatsOn();

  return whatsOn.getProgrammingInfo(channelName).then(function(programInfo) {
    res.say(whatsOn.formatProgrammingStatus(programInfo));
  });
}

/**
 * Handle requests to the changeChannelByNumber intent
 * 
 * @param {Object} req request object
 * @param {Object} res response object
 */
function handleChangeChannelByNumberRequest(req, res) {
  var channelNumber = req.slot('CHANNEL_NUMBER');
  var whatsOn = new WhatsOn();

  return whatsOn.tuneToChannel(channelNumber).then(function(programInfo) {
    res.say('OK, tuning to channel ' + (channelNumber||'') ).send();
  });
}

/**
 * Handle requests to the changeChannelByName intent
 * 
 * @param {Object} req request object
 * @param {Object} res response object
 */
function handleChangeChannelByNameRequest(req, res) {
  var channelName = req.slot('CHANNEL_NAME');
  var whatsOn = new WhatsOn();

  return whatsOn.tuneToChannel(channelName).then(function(programInfo) {
    res.say('OK, tuning to channel ' + (programInfo.channelName||'') ).send();
  });
}


// hack to fix issues with custom lists
var utterancesMethod = app.utterances;
app.utterances = function() {
  return utterancesMethod().replace(/\{\-\|/g, '{');
};

module.exports = app;
exports.handler = app.lambda();
