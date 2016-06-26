var Sequelize = require('sequelize');

module.exports = function (sequelize) {
    var record = sequelize.define('records', {
        url: Sequelize.STRING,
        shorturl: Sequelize.STRING
    });

    sequelize.sync();
    return record;
};