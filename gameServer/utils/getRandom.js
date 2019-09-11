/**
 * 亂數區間
 * @param {*} min 最小值
 * @param {*} max 最大值
 */
var getRandom = function (min, max) {
    return Math.round(min + Math.random() * (max - min))
}

module.exports = getRandom