var Promise = require("bluebird");

var charMap = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя_1234567890";
var charWeight = charMap.length;

function to_url(number) {
    var url = '';
    while (number) {
        var remainder = (number % charWeight) - 1;
        url = charMap[remainder].toString() + url;
        number = Math.floor(number / charWeight);
    }
    return url;
}

function to_number(url) {
    var number = 1;
    while (url) {
        var index = charMap.indexOf(url[0]);
        var power = url.length - 1;
        number += index * (Math.pow(charWeight, power));
        url = url.substring(1);
    }
    return number;
}

module.exports = function (sequelize, DataTypes) {
    var records = sequelize.define('records', {
        url: {
            type: DataTypes.TEXT, allowNull: true
        },
        shorturl: {
            type: DataTypes.TEXT, allowNull: true,
            get: function () {
                return this.getDataValue('shorturl') || to_url(this.getDataValue('id'));
            }
        }
    }, {
        instaceMehods: {
            isNamed: function () {
                return this.getDataValue('shorturl') == null;
            }
        },
        classMethods: {
            findOneByShorturl: function (shortUrl) {
                var records = this;

                if (!shortUrl) return Promise.resolve().then(function () {
                    return null;
                });

                return records.findOne({where: {shorturl: shortUrl}}).then(function (record) {
                    if (record) return record;
                    return records.findOne({where: {id: to_number(shortUrl)}});
                });
            },
            findAndCountByShorturl: function (shortUrl) {
                var records = this;
                if (!shortUrl) return Promise.resolve().then(function () {
                    return null;
                });

                records.findAndCountAll({
                    where: {
                        $or: {
                            shorturl: shortUrl,
                            id: to_number(shortUrl)
                        }
                    }
                });
            }
        }
    });

    sequelize.sync();
    return records;
};