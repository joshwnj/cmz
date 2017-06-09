const cmz = require('cmz')

// you can define modules of atoms
module.exports.shadow = cmz(`
  box-shadow: 1px 1px 5px #000
`)

const makeItRed = cmz('& { color: red; }')

module.exports.pulse = cmz([
  makeItRed,
  `
  & {
    animation: ? 1s infinite;
  }

  @keyframes ? {
    0% { opacity: 1; }
    50% { opacity: .5; }
  }
  `
])

module.exports.spin = cmz(`
  & {
    animation: ? 1s infinite linear;
  }

  @keyframes ? {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`)
