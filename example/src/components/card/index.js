const cmz = require('cmz')

// calling `cmz()` like this, with no arguments,
// means cmz will reference a css module with the
// corresponding name to this js module (aka index.css)
const styles = cmz()

module.exports = function (props) {
  return `
<div class="${styles('card')}">
  <div class="${styles('inner')}">
     <img class="${styles('image')}" src="${props.image}" />
  </div>
</div>
  `
}
