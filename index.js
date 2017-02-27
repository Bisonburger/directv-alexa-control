/**
 * AWS Lambda service for controlling DIRECTV
 * 
 * @license ISC    
 * @copyright 2017, BISONWORKS, LLC
 */
module.change_code = 1;
var Alexa = require('alexa-app'),
  app = new Alexa.app('DirecTV'),
  WhatsOn = require('./whats-on');


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
      'LOCATION': 'LOCATIONS'
    },
    'utterances': [
      '{what\'s|what is} on',
      '{what\'s|what is} on in the {-|LOCATION}'
    ]
  },
  handleWhatsOnCurrentChannelRequest);

/*
 * whatsOnByNumberIntent - allows the user to request what is playing on
 *  a channel by the channel's number
 */
app.intent('whatsOnByNumberIntent', {
    'slots': {
      'CHANNEL_NUMBER': 'NUMBER',
      'LOCATION': 'LOCATIONS'
    },
    'utterances': [
      '{what\'s|what is} on channel {-|CHANNEL_NUMBER}',
      '{what\'s|what is} on channel {-|CHANNEL_NUMBER} in the {-|LOCATION}',
      '{what\'s|what is} on in the {-|LOCATION} on channel {-|CHANNEL_NUMBER}'
    ]
  },
  handleWhatsOnByNumberRequest);

/*
 * whatsOnByNameIntent - allows the user to request what is playing on
 *  a channel by the channel's name
 */
app.intent('whatsOnByNameIntent', {
    'slots': {
      'CHANNEL_NAME': 'CHANNELS',
      'LOCATION': 'LOCATIONS'
    },
    'utterances': [
      '{what\'s|what is} on {-|CHANNEL_NAME}',
      '{what\'s|what is} on {-|CHANNEL_NAME} in the {-|LOCATION}',
      '{what\'s|what is} on in the {-|LOCATION} on {-|CHANNEL_NAME}',
    ]
  },
  handleWhatsOnByNameRequest);

/*
 * changeChannelByNumberIntent - allows the user to request to change to a
 *  a channel by the channel's number
 */
app.intent('changeChannelByNumberIntent', {
    'slots': {
      'CHANNEL_NUMBER': 'NUMBER',
      'LOCATION': 'LOCATIONS'
    },
    'utterances': [
      '{change|switch|tune} to channel {-|CHANNEL_NUMBER}',
      '{change|switch|tune} to channel {-|CHANNEL_NUMBER} in the {-|LOCATION}',
      '{change|switch|tune} the {-|LOCATION} to channel {-|CHANNEL_NUMBER}'
    ]
  },
  handleChangeChannelByNumberRequest);
  
/*
 * changeChannelByNameIntent - allows the user to request to change to a
 *  a channel by the channel's name
 */
app.intent('changeChannelByNameIntent', {
    'slots': {
      'CHANNEL_NAME': 'CHANNELS',
      'LOCATION': 'LOCATIONS'
    },
    'utterances': [
      '{change|switch|tune} to {-|CHANNEL_NAME}',
      '{change|switch|tune} to channel {-|CHANNEL_NAME} in the {-|LOCATION}',
      '{change|switch|tune} the {-|LOCATION} to channel {-|CHANNEL_NAME}'
    ]
  },
  handleChangeChannelByNameRequest);
  
/**
 * By default for all requests set the LOCATION to TV Room
 */
app.pre = prePOST;

/**
 * By default for all requests set the LOCATION to TV Room
 * 
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {String} type request type (IntentRequest,LaunchRequest,SessionEndRequest)
 */
function prePOST(request,response,type){
  if( !request.data.request.intent.slots.LOCATION ){
    request.data.request.intent.slots.LOCATION = { "value": "TV room", "name": "LOCATION" };
  }
}

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
  var whatsOn = new WhatsOn(),
      location = req.slot('LOCATION');

  return whatsOn.getCurrentChannel(location).then(function(programInfo) {
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
  var channelNumber = req.slot('CHANNEL_NUMBER'),
    location = req.slot('LOCATION');

  var whatsOn = new WhatsOn();

  return whatsOn.getProgrammingInfo(channelNumber,location).then(function(programInfo) {
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
  var channelName = req.slot('CHANNEL_NAME'),
    location = req.slot('LOCATION'),
    whatsOn = new WhatsOn();

  return whatsOn.getProgrammingInfo(channelName,location).then(function(programInfo) {
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
  var channelNumber = req.slot('CHANNEL_NUMBER'),
    location = req.slot('LOCATION'),
    whatsOn = new WhatsOn();

  return whatsOn.tuneToChannel(channelNumber,location).then(function(programInfo) {
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
  var channelName = req.slot('CHANNEL_NAME'),
    location = req.slot('LOCATION'),
    whatsOn = new WhatsOn();

  return whatsOn.tuneToChannel(channelName,location).then(function(programInfo) {
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
