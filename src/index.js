var express = require('express');
var router = express.Router();
var request_promise = require('request-promise');
var Promise = require("bluebird");
var urijs = require('uri-js');
var punycode = require("punycode");
var sequelize = require('./models/index')();
var dbRecord = sequelize.import('./models/record');

function createError(message, code) {
    var error = new Error(message);
    error.code = code;
    return error;
}

router.get('/:shortUrl', function (request, response) {
    dbRecord
        .findOneByShorturl(request.params.shortUrl)
        // Check if shortened link found and return url
        .then(function (record) {
            if (!record) throw createError("Ссылка не найдена.", 404);
            return record.get('url');
        })
        // Redirect to give url(uri)
        .then(function (url) {
            response.redirect(301, url);
        })
        // Catch errors
        .catch(function (error) {
            if (error.code) response.status(error.code);
            else {
                response.status(409);
                error.message = "Ошибка";
        }

        response.send(error.message);
    });
});

function buildNamedLinkCreationPromise(linkName, url) {
    return dbRecord
        .findOneByShorturl(linkName)
        // Check if linkName unique and throw an error if not
        .then(function (record) {
            if (record) throw createError("Такое имя ссылки записи уже занято.", 409);
        })
        // Create a record
        .then(function () {
            return dbRecord.create({
                'url': url,
                'shorturl': linkName
            });
        });
}

function buildUnNamedLinkCreationPromise(url) {
    //Create new record
    return dbRecord
        .create({'url': url})
        // Find record with same shortened url(named links have more priority )
        .then(function (new_record) {
            linkName = new_record.get('shorturl');
            return dbRecord
                .findOneByShorturl(linkName)
                // Check if it's unique
                .then(function (record) {
                    if (record.get('id') != new_record.get('id')) return buildUnNamedLinkCreationPromise(url);
                    return new_record;
                });
        });
}

router.post('/shorten', function (request, response) {
    var url = request.body.url;
    var name = request.body.name;

    Promise
        .resolve()
        // Normalize URL(convert to URI) and validate
        .then(function () {
            // Normalize URI
            var parts = urijs.parse(url);
            if (parts.scheme == null || parts.error) {
                url = "http://" + url;
                url = url.replace("////", "//");
                parts = urijs.parse(url);
            }
            url = urijs.normalize(url);

            // Validate URI
            if (urijs.normalize(parts.host) == urijs.normalize(request.hostname))
                throw createError("Попытка создания рекурсивной ссылки.", 409);

            //return request_promise(url);
        })
        // Find present record for this url
        .then(function () {
            return dbRecord.findOne({where: {url: url}});
        })
        // Create new record in DB if needed and return record if not
        .then(function (record) {
            if (name) return buildNamedLinkCreationPromise(name, url);
            if (record) return record;
            return buildUnNamedLinkCreationPromise(url);
        })
        // Send shortened link to user
        .then(function (record) {
            // Decode current hostname (punycode)
            var url = "http://" + request.get('host') + '/' + record.get('shorturl');
            var domain = punycode.toUnicode(request.hostname);
            url = url.replace(request.hostname, domain);

            // Send
            response.status(200);
            response.send(url);
        })
        // Catch errors
        .catch(function (error) {
            if (error.code) response.status(error.code);
            else {
                response.status(409);
                error.message = "Ошибка";
            }

            response.send(error.message);
    });
});

module.exports = router;