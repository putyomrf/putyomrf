var charMap = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя_1234567890";
var charWeight = charMap.length;

function to_url(number) {
    var url = '';
    while (number) {
        var remainder = number % charWeight;
        number = Math.floor(number / charWeight);
        url = charMap[remainder].toString() + url;
    }
    return url;
}

function to_number(url) {
    var number = 0;
    while (url) {
        var index = charMap.indexOf(url[0]);
        if (index < 0) return -1;
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
    });

    sequelize.sync();
    return records;
};