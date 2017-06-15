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

// you can create helper functions that construct css,
// like applying rules when the viewport is wider than a certain width
const widerThan = (width, css) => cmz(`
@media screen and (min-width: ${width}px) {
  & {
    ${css}
  }
}
`)

// you can create an atom by combining css rules:
const box = cmz('box', [
  'width: 500px',
  'margin: 20px auto',
  'padding: 20px',
  widerThan(600, 'color: lightseagreen'),
  widerThan(800, 'color: royalblue'),
  widerThan(1024, 'color: coral')
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

// cmz.import is a shortcut to @import url(...)
cmz.import('./theme.css')

module.exports = function (props) {
  return `
  <div ${attr(cmz([bigText, shadow]))}>big condensed text with a shadow</div>
  <div ${attr(medText)}>medium text</div>
  <div ${attr(smallText)}>small bold text</div>
`
}
