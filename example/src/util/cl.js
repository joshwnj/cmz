// shortcut for creating a `class=""` attribute
// for a css module
module.exports = function cl (styles) {
  const map = {}
  Object.keys(styles).forEach((k) => {
    map[k] = `class="${styles[k]}"`
  })
  return map
}
