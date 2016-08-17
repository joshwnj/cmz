// shortcut for creating a `class=""` attribute
// for a css module
module.exports = function cl (styles) {
  return function (names) {
    names = names || ''
    if (typeof names === 'string') { names = [names] }
    return `class="${names.map(styles.bind(null)).join(' ')}"`
  }
}
