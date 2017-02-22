'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var WhatsOn = require('../whats_on');
chai.config.includeStack = true;
var Promise = require('bluebird');

describe('WhatsOn', function() {
    var subject = new WhatsOn();
    var channel;

    describe('#getProgrammingInfo', function() {
        context('with a valid channel', function() {
            it('returns channel', function() {
                channel = 4;
                var value = subject.getProgrammingInfo(channel).then(function(obj) {
                    return obj.major;
                });
                return expect(value).to.eventually.eq(channel);
            });
        });

        context('with a valid channel name', function() {
            it('returns channel', function() {
                channel = 'NBC';
                var value = subject.getProgrammingInfo(channel).then(function(obj) {
                    return obj.major;
                });
                return expect(value).to.eventually.eq(4);
            });
        });

        context('with a valid channel name in wrong case', function() {
            it('returns channel', function() {
                channel = 'kVoA';
                var value = subject.getProgrammingInfo(channel).then(function(obj) {
                    return obj.major;
                });
                return expect(value).to.eventually.eq(4);
            });
        });
        
        context('with a valid channel name array', function() {
            it('returns channel array', function() {
                channel = 'HBO';
                var value = subject.getProgrammingInfo(channel);
                var first = Promise.all(value).then( function(){
                    return value[0].major;   
                } );
                return expect(first).to.eventually.eq(501);
                
            }).timeout( 10000 );
        });

        context('with an invalid channel', function() {
            it('returns an error', function() {
                channel = 0;
                return expect(subject.getProgrammingInfo(channel)).to.be.rejectedWith(Error);
            });
        });

        context('with an invalid channel name', function() {
            it('returns an error', function() {
                channel = 'My Special Channel';
                return expect(subject.getProgrammingInfo(channel)).to.be.rejectedWith(Error);
            });
        });
    });

    describe('#formatProgrammingStatus', function() {
        context('with a single channel', function() {
            it('formats properly', function() {
                var status = {
                    "callsign": "KVOA",
                    "major": 4,
                    "title": "Today"
                };

                var formatted = subject.formatProgrammingStatus(status);
                return expect(formatted).to.eq('Today is on channel 4');
            });
        });

        context('with an array of channels', function() {
            it('formats properly', function() {
                var status = [{
                    "callsign": "KVOA",
                    "major": 4,
                    "title": "Today",
                    "channelName": "NBC"
                }, {
                    "callsign": "KGUN",
                    "major": 9,
                    "minor": 65535,
                    "title": "Maury",
                    'episodeTitle': "Am I The Daddy?"
                }];
                var formatted = subject.formatProgrammingStatus(status);
                return expect(formatted).to.eq('Today is on NBC\nMaury, Am I The Daddy?, is on channel 9');
            });
        });

    });
});
