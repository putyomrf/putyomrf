var Sequelize = require('sequelize');

module.exports = function (sequelize) {
    var record = sequelize.define('records', {
        url: {type: Sequelize.TEXT, allowNull: false},
        shorturl: {type: Sequelize.TEXT, allowNull: true}
    });

    sequelize.sync();
    return record;
};