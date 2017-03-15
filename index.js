const upsertCss = require('./lib/upsert-css')
const createName = require('./lib/create-name')

function isName (val) {
  if (!val) { return false }
  return /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(val)
}

function addSemis (raw) {
  return raw.replace(/([^;])\n/g, '$1;\n')
}

function cmz (prefix, raw) {
  if (!isName(prefix)) {
    return new CmzAtom(createName(), prefix)
  }

  return new (typeof raw === 'string' ? CmzAtom : CmzMod)(prefix, raw)
}

function CmzMod (prefix, raw) {
  // we'll use the same prefix for all atoms in this family
  this._prefix = prefix || createName()
  this._atoms = {}
  if (raw) { this.add(raw) }
}

CmzMod.prototype.add = function (raw) {
  const self = this
  Object.keys(raw).forEach(function (k) {
    if (raw[k] instanceof CmzAtom) {
      // families can include pre-created atoms
      self._addAtom(k, raw[k])
      return
    }

    const name = self._prefix + '__' + k
    if (Array.isArray(raw[k])) {
      var comps = []
      var rules = []
      raw[k].forEach(function (item) {
        if (item instanceof CmzAtom || isName(item)) {
          comps.push(item)
        } else {
          rules.push(item)
        }
      })
      self._addAtom(k, new CmzAtom(name, rules))
      if (comps.length) {
        self[k].compose(comps)
      }
    } else {
      // use the family key to make the classname a bit more descriptive
      self._addAtom(k, new CmzAtom(name, raw[k]))
    }
  })
  return this
}

CmzMod.prototype._addAtom = function (key, atom) {
  // expose atoms directly (but warn if there's a name clash)
  if (this[key]) {
    console.warn('[cmz] %s already exists in module %s', key, this._prefix)
  }
  this[key] = this._atoms[key] = atom
}

// compose 2 families together
CmzMod.prototype.compose = function (other) {
  const self = this
  Object.keys(other._atoms).forEach(function (k) {
    if (self._atoms[k]) {
      self._atoms[k].compose(other[k])
    } else {
      self._addAtom(k, other[k])
    }
  })

  return this
}

function CmzAtom (name, raw) {
  this.name = name || createName()
  this.raw = raw
  this.comps = []
}

CmzAtom.prototype.hasCss = function () {
  return this.raw && this.raw.length > 0
}

CmzAtom.prototype.getCss = function () {
  if (!this.hasCss()) { return '' }

  const parts = typeof this.raw === 'string' ? [this.raw] : this.raw

  const wrapped = []
  const unwrapped = []
  parts.forEach(function (part) {
    // if no placeholder was given, we need to wrap it ourselves
    const isWrapped = part.indexOf('&') >= 0
    const group = isWrapped ? wrapped : unwrapped
    group.push(part)
  })

  const selector = '.' + this.name
  var output = ''

  if (unwrapped.length) {
    output += selector + ' {' + addSemis(unwrapped.join('\n')) + '}'

    if (wrapped.length) { output += '\n' }
  }

  if (wrapped.length) {
    // replace the placeholder with the unique name
    output += wrapped.map(part => part.replace(/&/g, selector)).join('\n')
  }

  return output
}

CmzAtom.prototype.toString = function () {
  // need to call toString() on the comps first,
  // so that they appear higher in source
  const fullName = this.getFullName()

  // only need to insert css if we have any
  const css = this.getCss()
  css && upsertCss(this.name, css)

  return fullName
}

CmzAtom.prototype.getFullName = function () {
  const comps = this.comps.join(' ')
  return this.hasCss()
    ? this.name + (comps && (' ' + comps))
    : comps
}

CmzAtom.prototype.compose = function (comps) {
  if (!Array.isArray(comps)) { comps = [comps] }
  this.comps = this.comps.concat(comps)
  return this
}

cmz.Mod = CmzMod
cmz.Atom = CmzAtom
cmz.reset = createName.reset

module.exports = cmz
