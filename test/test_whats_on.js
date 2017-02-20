'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var WhatsOn = require('../whats_on');
chai.config.includeStack = true;

describe('WhatsOn', function() {
    var subject = new WhatsOn();
    var channel;
    describe('#getProgrammingInfo', function() {
        context('with a valid channel', function() {
            it('returns channel', function() {
                channel = 4;
                var value = subject.requestWhatsOn(channel).then(function(obj) {
                    return obj.IATA;
                });
                return expect(value).to.eventually.eq(channel);
            });
        });
    });
});
