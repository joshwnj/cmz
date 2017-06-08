const cmz = require('.')

module.exports = function (input) {
  return {
    className: cmz(input)
  }
}

module.exports.string = function (input) {
  return 'class="' + input + '"'
}
