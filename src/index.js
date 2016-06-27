var express = require('express');
var router = express.Router();
var urllib = require('url');

var sequelize = require('./models/index')();
var dbRecord = sequelize.import('./models/record');

function createError(message, code) {
    var error = new Error(message);
    error.code = code;
    return error;
}

router.get('/:shortUrl', function (request, response) {
    dbRecord.findOneByShorturl(request.params.shortUrl).then(function (record) {
        if (!record) throw createError("Ссылка не найдена.", 404);

        return record.get('url');
    }).then(function (url) {
        response.redirect(303, url);
    }).catch(function (error) {
        switch (error.code) {
            case 404:
                response.status(404);
                break;
            default:
                response.status(500);
                error.message = "Ошибка";
                break;
        }
        response.send(error.message);
    });
});

router.post('/shorten', function (request, response) {
    var url = request.body.url;
    var name = request.body.name;
    
    //-------------------------url validation----------------------
    var parts = urllib.parse(url, false);
    if (parts.protocol == null) {
        parts.protocol = 'http';
        parts.slashes = true;
        parts.hostname = parts.pathname;
        parts.pathname = null
    }
    parts.protocol = parts.protocol.toLowerCase();
    parts.hostname = parts.hostname.toLowerCase();
    url = urllib.format(parts);
    //-------------------------url validation----------------------

    dbRecord.findOne({where: {url: url}}).then(function (record) {
        if (!name && record) return record;

        return dbRecord.findOneByShorturl(name).then(function (record) {
            if (record) throw createError("Такое имя записи уже занято.", 409);

            return dbRecord.create({
                'url': url,
                'shorturl': name || null
            });
        });
    }).then(function (record) {
        response.send(request.get('host') + '/' + record.get('shorturl'));
    }).catch(function (error) {
        switch (error.code) {
            case 409:
                response.status(409);
                break;
            default:
                response.status(500);
                error.message = "Ошибка";
                break;
        }
        response.send(error.message);
    });
});

module.exports = router;