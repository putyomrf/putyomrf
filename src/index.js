var express = require('express');
var router = express.Router();

router.get('/:shortUrl', function (request, response) {
    response.redirect(303, 'http://test.com');
});

router.post('/shorten', function (request, response) {
    response.send(request.get('host') + '/' + '');
});

module.exports = router;