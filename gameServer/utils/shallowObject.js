/**
 * 物件針對key進行vale加法
 * @param {*} a 物件A
 * @param {*} b 物件B
 */
var plus = function (a, b) {
  Object.keys(b).map(e => {
    if (a[e]) {
      a[e] += b[e]
    } else {
      a[e] = b[e]
    }
  })
}

/**
 * 物件針對key進行vale減法
 * @param {*} a 物件A
 * @param {*} b 物件B
 */
var minus = function (a, b) {
  Object.keys(b).map(e => {
    if (a[e] !== undefined) {
      a[e] -= b[e]
    } else {
      a[e] = -b[e]
    }
  })
}

module.exports = {
  plus,
  minus
}