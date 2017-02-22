module.change_code = 1;
var Alexa = require('alexa-app');
var app = new Alexa.app('DirecTV');
var WhatsOn = require('./whats_on');

app.launch(function(req, res) {
  var prompt = 'For programming information, tell me a channel number or name';
  res.say(prompt).reprompt('Tell me a channel').shouldEndSession(false);
});

app.intent('whatsOnCurrentChannelIntent', {
    'slots': {
    },
    'utterances': [
      '{what\'s|what is} {on}'
    ]
  },
  handleWhatsOnCurrentChannelRequest);


app.intent('whatsOnByNumberIntent', {
    'slots': {
      'CHANNEL_NUMBER': 'NUMBER'
    },
    'utterances': [
      '{what\'s|what is} on channel {-|CHANNEL_NUMBER}'
    ]
  },
  handleWhatsOnByNumberRequest);

app.intent('whatsOnByNameIntent', {
    'slots': {
      'CHANNEL_NAME': 'CHANNELS'
    },
    'utterances': [
      '{what\'s|what is} on {-|CHANNEL_NAME}'
    ]
  },
  handleWhatsOnByNameRequest);

app.intent('changeChannelByNumberIntent', {
    'slots': {
      'CHANNEL_NUMBER': 'NUMBER'
    },
    'utterances': [
      '{change|switch|go|tune} to channel {-|CHANNEL_NUMBER}'
    ]
  },
  handleChangeChannelByNumberRequest);
  
app.intent('changeChannelByNameIntent', {
    'slots': {
      'CHANNEL_NAME': 'CHANNELS'
    },
    'utterances': [
      '{change|switch|go|tune} to {-|CHANNEL_NAME}'
    ]
  },
  handleChangeChannelByNumberRequest);
  
function handleWhatsOnCurrentChannelRequest(req,res){
  var whatsOn = new WhatsOn();

  return whatsOn.getCurrentChannel().then(function(programInfo) {
    res.say(whatsOn.formatProgrammingStatus(programInfo)).send();
  });
}


function handleWhatsOnByNumberRequest(req, res) {
  var channelNumber = req.slot('CHANNEL_NUMBER');

  var whatsOn = new WhatsOn();

  return whatsOn.getProgrammingInfo(channelNumber).then(function(programInfo) {
    res.say(whatsOn.formatProgrammingStatus(programInfo)).send();
  });
}

function handleWhatsOnByNameRequest(req, res) {
  var channelName = req.slot('CHANNEL_NAME');
  var whatsOn = new WhatsOn();

  return whatsOn.getProgrammingInfo(channelName).then(function(programInfo) {
    res.say(whatsOn.formatProgrammingStatus(programInfo));
  });
}

function handleChangeChannelByNumberRequest(req, res) {
  var channelNumber = req.slot('CHANNEL_NUMBER');
  var whatsOn = new WhatsOn();

  return whatsOn.tuneToChannel(channelNumber).then(function(programInfo) {
    res.say('OK, tuning to channel ' + channelNumber ).send();
  });
}

// hack to fix issues with custom lists
var utterancesMethod = app.utterances;
app.utterances = function() {
  return utterancesMethod().replace(/\{\-\|/g, '{');
};

module.exports = app;
exports.handler = app.lambda();
