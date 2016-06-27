var express = require('express');
var router = express.Router();

var sequelize = require('./models/index')();
var dbRecord = sequelize.import('./models/record');

router.get('/:shortUrl', function (request, response) {
    dbRecord.findOneByShorturl(request.params.shortUrl).then(function (record) {
        var promise = sequelize.sync();
        if (record) {
            promise = promise.then(function () {
                return record.get('url');
            });
        }
        else {
            promise = promise.then(function () {
                throw new Error('Not Found');
            });
        }

        promise = promise.then(function (url) {
            response.redirect(303, url);
        });

        promise = promise.catch(function (error) {
            console.log(error.toString());
            response.end();
        })
    });
});

router.post('/shorten', function (request, response) {
    var url = request.body.url;
    // TODO: Add url validation and encoding
    dbRecord.findOne({where: {url: url}}).then(function (record) {
        var promise = sequelize.sync();
        if (record) {
            promise = promise.then(function () {
                return record;
            })
        } else {
            promise = dbRecord.create({
                'url': url,
                'shorturl': null
            });
        }

        promise = promise.then(function (record) {
            var shortUrl = record.get('shorturl');
            response.send(request.get('host') + '/' + shortUrl);
        });

        promise = promise.catch(function (error) {
            console.log(error.toString());
            response.end();
        });
    });
});

module.exports = router;