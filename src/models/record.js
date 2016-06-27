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
            type: DataTypes.TEXT, allowNull: false
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
            findOneByShorturl: function (shorturl) {
                return this.findOne({where: {$or: {shorturl: shorturl, id: to_number(shorturl)}}})
            }
        }
    });

    sequelize.sync();
    return records;
};