/**
 * 延遲幾ms
 * @param {*} time
 */
var delay = function(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve, time)
  })
}

module.exports = delay
