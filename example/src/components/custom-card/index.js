const cmz = require('cmz')
const cardStyles = require('../card').styles

const image = cmz(`
  transform: rotate(-180deg);
  transition: transform 1s ease-in-out;
`)

const styles = cmz({
  root: `
& {
  border-radius: 0;
}

&:hover .${image.name} {
  transform: rotate(0deg);
}
`,
  image
}).compose(cardStyles)

module.exports = function (props) {
  return `
<div class="${styles.root}">
  <div class="${styles.inner}">
     <img class="${styles.image}" src="${props.image}" />
  </div>
</div>
  `
}
