const upsertCss = require('./upsert-css')
const uniquifyName = require('./uniquify-name')

function isName (val) {
  if (!val) { return false }
  return /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(val)
}

function addSemis (raw) {
  return raw.replace(/([^;])\n/g, '$1;\n')
}

function renderCss (name, pseudo, raw) {
  const selector = '.' + name + (pseudo ? ':' + pseudo : '')
  var output = ''

  const parts = typeof raw === 'string' ? [raw] : raw

  const wrapped = []
  const unwrapped = []
  parts.forEach(function (part) {
    // replace name placeholders
    part = part.replace(/\?/g, name)

    // if no selector placeholder was given, we need to wrap it ourselves
    const isWrapped = part.indexOf('{') >= 0
    const group = isWrapped ? wrapped : unwrapped
    group.push(part)
  })

  if (unwrapped.length) {
    output += selector + ' {' + addSemis(unwrapped.join('\n')) + '}'

    if (wrapped.length) { output += '\n' }
  }

  if (wrapped.length) {
    // replace selector placeholders with the unique selector
    output += wrapped.map(function (part) {
      return part.replace(/&/g, selector)
    }).join('\n')
  }

  return output
}

function cmz (name, raw) {
  if (raw === undefined) {
    raw = name
    name = null
  }
  return new Atom(name, raw)
}

cmz.pseudo = function (type, atom) {
  const name = atom.name + '-' + type
  return new Atom(
    name,
    renderCss(name, type, atom.raw)
  ).compose(
    // recursively pseudo-ify compositions
    atom.comps.map(function (c) { return cmz.pseudo(type, c) })
  )
}

cmz.widerThan = function (width, atom) {
  const name = atom.name + '-widerThan-' + width
  const css = renderCss(name, null, atom.raw)
  return new Atom(
    name,
    '@media screen and (min-width: ' + width + 'px) { ' + css + ' }'
  )
}

function Atom (name, raw) {
  this.name = uniquifyName(name)

  this.raw = []
  this.comps = []
  this.compose(raw)
}

Atom.prototype.compose = function (parts) {
  if (!Array.isArray(parts)) { parts = [parts] }

  const self = this
  parts.filter(Boolean).forEach(function (p) {
    const isComp = isName(p) || p instanceof Atom
    self[isComp ? 'comps' : 'raw'].push(p)
  })

  return this
}

Atom.prototype.hasCss = function () {
  return this.raw && this.raw.length
}

Atom.prototype.getCss = function () {
  if (!this.hasCss()) { return '' }

  const name = this.name
  return renderCss(name, null, this.raw)
}

Atom.prototype.toString = function () {
  const fullName = this.getFullName()

  // only need to insert css if we have any
  const css = this.getCss()
  css && upsertCss(this.name, css)

  return fullName
}

Atom.prototype.getFullName = function () {
  return [ this.name ].concat(this.comps).join(' ')
}

cmz.Atom = Atom
cmz.reset = uniquifyName.reset
cmz.sheets = upsertCss.sheets
module.exports = cmz
