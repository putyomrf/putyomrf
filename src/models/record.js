var Sequelize = require('sequelize');

var record = sequelize.define('records', {
    longurl: Sequelize.STRING,
    shorturl: Sequelize.STRING
});

module.exports.record = record;