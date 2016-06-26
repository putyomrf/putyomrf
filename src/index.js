var express = require('express');
var router = express.Router();

var sequelize = require('./models/index')();
var dbRecord = require('./models/record')(sequelize);

router.get('/:shortUrl', function (request, response) {
    response.redirect(303, 'http://test.com');
});

router.post('/shorten', function (request, response) {
    response.send(request.get('host') + '/' + '');
});

module.exports = router;