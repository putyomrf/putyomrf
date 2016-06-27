var express = require('express');
var router = express.Router();
var urllib = require('url');

var sequelize = require('./models/index')();
var dbRecord = sequelize.import('./models/record');

router.get('/:shortUrl', function (request, response) {
    dbRecord.findOneByShorturl(request.params.shortUrl).then(function (record) {
        if (record) return record.get('url');
        throw new Error('Not Found');
    }).then(function (url) {
        response.redirect(303, url);
    }).catch(function (error) {
        response.send(error.toString());
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
        if (record) return record;
        return dbRecord.create({
            'url': url,
            'shorturl': name || null
        });
    }).then(function (record) {
        response.send(request.get('host') + '/' + record.get('shorturl'));
    }).catch(function (error) {
        response.send(error.toString());
    });
});

module.exports = router;