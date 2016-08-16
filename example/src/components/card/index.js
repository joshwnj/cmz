const cmz = require('cmz')
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
