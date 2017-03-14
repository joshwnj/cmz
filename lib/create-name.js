var nameCounter = 0
module.exports = function createName () {
  const name = 'cmz-' + nameCounter
  nameCounter += 1
  return name
}
module.exports.reset = function () {
  nameCounter = 0
}
