var Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('records', {
        longurl: Sequelize.STRING,
        shorturl: Sequelize.STRING
    });
};