var chai = require('chai');
var expect = chai.expect;
var model = require('../src/Model');

describe('model.shorten.normalizeUrl()', function () {
    it('model.shorten.normalizeUrl() should turn URL into URI', function () {
        expect(model.shorten.normalizeUrl("https://wWw.exAmple.com")).to.equal("https://www.example.com/");
        expect(model.shorten.normalizeUrl("http://www.example.com")).to.equal("http://www.example.com/");
        expect(model.shorten.normalizeUrl("www.example.com")).to.equal("http://www.example.com/");

        expect(model.shorten.normalizeUrl("www.example.com:8888")).to.equal("http://www.example.com:8888/");
        expect(model.shorten.normalizeUrl("http://www.example.com:8888")).to.equal("http://www.example.com:8888/");

        expect(model.shorten.normalizeUrl("127.0.0.1")).to.equal("http://127.0.0.1/");
        expect(model.shorten.normalizeUrl("127.0.0.1:8888")).to.equal("http://127.0.0.1:8888/");
        expect(model.shorten.normalizeUrl("https://127.0.0.1")).to.equal("https://127.0.0.1/");
        expect(model.shorten.normalizeUrl("http://127.0.0.1:8888")).to.equal("http://127.0.0.1:8888/");

    });
});