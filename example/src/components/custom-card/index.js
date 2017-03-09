const cmz = require('cmz')
const cardStyles = require('../card').styles

// In this case we'll create the module first,
// and then start adding classes, so we can reference
// the scoped names internally. (eg. `&:hover .${styles.image.name}`)
const styles = cmz('CustomCard', {
  image: `
  transform: rotate(-180deg);
  transition: transform 1s ease-in-out;
`})

styles.add({
  root: `
& {
  border-radius: 0;
}

&:hover .${styles.image.name} {
  transform: rotate(0deg);
}
`
})

styles.compose(cardStyles)

module.exports = function (props) {
  return `
<div class="${styles.root}">
  <div class="${styles.inner}">
     <img class="${styles.image}" src="${props.image}" />
  </div>
</div>
  `
}
