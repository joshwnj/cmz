const cmz = require('cmz')
const attr = require('cmz/attr').string

// you can define atoms that define common rules
const shadow = cmz('box-shadow: 1px 1px 5px #000')

// you can also create functions that return atoms
const BASE_SIZE = 16
const fontSize = (size) => cmz([
  // cubic sizing
  `font-size: ${(size * size * size) + BASE_SIZE}px`,

  // big text will be condensed, smaller text is normal
  size > 2 && `letter-spacing: -.07em`
])

const boxVariants = {
  small: cmz('color: lightseagreen'),
  medium: cmz('color: royalblue'),
  large: cmz('color: coral')
}

// you can create an atom by combining css rules:
const box = cmz('box', [
  'width: 500px',
  'margin: 20px auto',
  'padding: 20px',
  // you can wrap an atom in a media query
  cmz.widerThan(600, boxVariants.small),
  cmz.widerThan(800, boxVariants.medium),
  cmz.widerThan(1024, boxVariants.large),
])

// you can also create an atom by composing existing atoms:
const bigText = cmz([
  box,
  fontSize(3),
  // you can take an existing atom and apply it with a pseudo-selector
  cmz.pseudo('hover', require('./effects').pulse)
])

const medText = cmz([
  box,
  fontSize(2)
])

// or a comnbination of the two
const smallText = cmz([
  box,
  fontSize(1),
  'font-weight: 800'
])

// and even just write some good old global css
// (it is applied to the document when we toString it)
cmz(`
body {
  padding: 0;
  margin: 0;
  background: azure;
}
`).toString()

module.exports = function (props) {
  return `
  <div ${attr(cmz([bigText, shadow]))}>big condensed text with a shadow</div>
  <div ${attr(medText)}>medium text</div>
  <div ${attr(smallText)}>small bold text</div>
`
}
