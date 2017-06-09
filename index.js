const upsertCss = require('./lib/upsert-css')
const uniquifyName = require('./lib/uniquify-name')

function isName (val) {
  if (!val) { return false }
  return /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(val)
}

function addSemis (raw) {
  return raw.replace(/([^;])\n/g, '$1;\n')
}

function cmz (name, raw) {
  if (raw === undefined) {
    raw = name
    name = null
  }
  return new Atom(name, raw)
}

cmz.pseudo = function (type, atom) {
  const selector = '&:' + type
  const p = new Atom(
    atom.name + '-' + type,
    // pseudo-ify raw parts
    atom.raw.map(r => {
      const isWrapped = r.indexOf('{') >= 0
      return isWrapped ?
        r.replace(/&/g, selector) :
        selector + '{ ' + r + ' }'
    })
  ).compose(
    // recursively pseudo-ify compositions
    atom.comps.map(c => cmz.pseudo(type, c))
  )

  return p
}

cmz.import = function (path) {
  const name = 'import-' + path
  upsertCss(name, '@import url("' + path + '");')
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

  const parts = typeof this.raw === 'string' ? [this.raw] : this.raw

  const name = this.name
  const selector = '.' + name
  var output = ''

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

Atom.prototype.toString = function () {
  const fullName = this.getFullName()

  // only need to insert css if we have any
  const css = this.getCss()
  css && upsertCss(this.name, css)

  return fullName
}

Atom.prototype.getFullName = function () {
  const comps = this.comps.join(' ')
  return this.hasCss()
    ? this.name + (comps && (' ' + comps))
    : comps
}

cmz.Atom = Atom
cmz.reset = uniquifyName.reset

module.exports = cmz
