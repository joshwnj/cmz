const upsertCss = require('./upsert-css')
const uniquifyName = require('./uniquify-name')

function isName (val) {
  return val && /^[a-zA-Z][a-zA-Z0-9-_ ]*$/.test(val)
}

function addSemis (raw) {
  return raw.replace(/(\w+:[^;}\n]+?)(\s*}|\n|$)/g, '$1;$2')
}

function cmzNamed (name, ...parts) {
  const comps = [ name ]
  const raw = []

  // split parts into compositions & raw css
  parts.filter(Boolean).forEach((p) => {
    const group = isName(p) ? comps : raw
    group.push(p)
  })

  const css = renderCss(name, raw)
  css && upsertCss(name, css)

  return comps.join(' ')
}

function renderCss (name, parts) {
  const selector = `.${name}`
  var output = ''

  const wrapped = []
  const unwrapped = []
  parts.forEach(part => {
    // replace name placeholders
    part = part.replace(/\?/g, name)

    // if no selector placeholder was given, we need to wrap it ourselves
    const isWrapped = part.indexOf('{') >= 0
    const group = isWrapped ? wrapped : unwrapped
    group.push(part)
  })

  if (unwrapped.length) {
    output += selector + ' {' + unwrapped.join('\n') + '}'

    if (wrapped.length) { output += '\n' }
  }

  if (wrapped.length) {
    // replace selector placeholders with the unique selector
    output += wrapped
      .map((part) => part.replace(/&/g, selector))
      .join('\n')
  }

  return addSemis(output)
}

const cmz = (...parts) => cmzNamed(uniquifyName(), ...parts)
cmz.named = cmzNamed
cmz.reset = uniquifyName.reset
cmz.sheets = upsertCss.sheets

module.exports = cmz
