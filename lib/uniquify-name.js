var _names = { cmz: 0 }
module.exports = function uniquifyName (name) {
  name = name || 'cmz'
  var newName = name
  if (_names[name] !== undefined) {
    newName += '-' + _names[name]
    _names[name] += 1
  } else {
    _names[name] = 1
  }
  return newName
}
module.exports.reset = function () {
  _names = { cmz: 0 }
}
