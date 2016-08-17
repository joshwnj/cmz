const cmz = require('cmz')

// calling `cmz()` like this, with no arguments,
// means cmz will reference a css module with the
// corresponding name to this js module (aka index.css)
const styles = cmz()

// shortcut for creating a `class=""` attribute
const cl = require('../../util/cl')(styles)

module.exports = function (props) {
  return `
<div ${cl()}>
  <div ${cl('inner')}">
     <img ${cl('image')} src="${props.image}" />
  </div>
</div>
  `
}
