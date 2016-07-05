var express = require('express');
var router = express.Router();

var Promise = require("bluebird");
var punycode = require("punycode");

var model = require("./Model");

router.get('/:shortUrl', function (request, response, next) {
    model.redirect.retrieveURL(request.params.shortUrl).then(function (url) {
        response.redirect(301, url);
    }).catch(function (err) {
        next(err);
    });
});

router.post('/shorten', function (request, response, next) {
    Promise.join(request.body.name, model.shorten.normalizeUrlPromise(request.body.url), function (name, uri) {
        if (name) return model.shorten.namedLinkPromise(name, uri);
        return model.shorten.unnamedLinkPromise(uri);
    }).then(function (record) {
        return "http://" + 'путём.рф' + '/' + record.get('shorturl');
    }).then(function (url) {
        response.status(200);
        response.send(url);
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;