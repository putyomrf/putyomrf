var Sequelize = require('sequelize');

var dblogin = process.env.DBLOGIN || 'putyomrf';
var dbpassword = process.env.DBPASS || 'empty';

module.exports = function () {
    return new Sequelize('putyomrf', dblogin, dbpassword, {
        logging: false,
        dialect: "sqlite",
        storage: 'database.sqlite'
    });
};