var sequelize = require('./Entities/index')();
var dbRecord = sequelize.import('./Entities/record');
var Promise = require("bluebird");
var urijs = require('uri-js');

function createError(message, code) {
    var error = new Error(message);
    error.code = code;
    return error;
}

var model = {};
model.redirect = {};
model.redirect.retrieveURL = function (shortedUrl) {
    return dbRecord.findOneByShorturl(shortedUrl).then(function (record) {
        if (!record) throw createError("Ссылка не найдена.", 404);
        return record.get('url');
    });
};

model.shorten = {};
model.shorten.normalizeUrlPromise = function (url) {
    return Promise
        .resolve(url)
        // Normalize URL(convert to URI) and validate
        .then(function (url) {
            // Normalize URI
            var parts = urijs.parse(url);
            if (parts.scheme == null || parts.error) {
                url = "http://" + url;
                url = url.replace("////", "//");
                parts = urijs.parse(url);
            }
            url = urijs.normalize(url);

            // Validate URI
            if (urijs.normalize(parts.host) == urijs.normalize('путём.рф'))
                throw createError("Попытка создания рекурсивной ссылки.", 409);

            return url;
        });
};

model.shorten.namedLinkPromise = function (name, uri) {
    return Promise
        .resolve(name, uri)
        // Check if linkName unique and throw an error if not
        .then(function (name, uri) {
            return dbRecord.findOneByShorturl(name)
                .then(function (record) {
                    if (record) throw createError("Такое имя ссылки записи уже занято.", 409);
                }).thenReturn(name, uri);
        })
        // Create a record
        .then(function (name, uri) {
            return dbRecord.create({
                'shorturl': name,
                'url': uri
            });
        });
};

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

model.shorten.unnamedLinkPromise = function (uri) {
    return Promise.resolve(uri).then(function (uri) {
        return dbRecord.findOne({where: {url: uri}});
    }).then(function (record) {
        if (record) return record;
        return buildUnNamedLinkCreationPromise(uri);
    })
};

module.exports = model;