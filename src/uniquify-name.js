var _names = { cmz: 0 }

module.exports = function uniquifyName (name) {
  if (name) { return name }

  var newName = 'cmz'
  if (_names.cmz !== undefined) {
    newName += '-' + _names.cmz
    _names.cmz += 1
  } else {
    _names.cmz = 1
  }
  return newName
}

module.exports.reset = function () {
  _names = { cmz: 0 }
}
