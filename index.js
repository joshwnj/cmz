const upsertCss = require('./lib/upsert-css')
const createName = require('./lib/create-name')

function cmz (raw) {
  if (typeof raw === 'string') { return createAtom(raw) }
  if (typeof raw === 'object') { return createFamily(raw) }
}

function createAtom (raw) {
  return new CmzAtom(null, raw)
}

function createFamily (atoms) {
  return new CmzFamily(createName(), atoms)
}

function CmzFamily (prefix, raw) {
  // we'll use the same prefix for all atoms in this family
  this._prefix = prefix || createName()
  this._atoms = {}
  this._addAtoms(raw)
}

CmzFamily.prototype._addAtoms = function (raw) {
  const self = this
  Object.keys(raw).forEach(k => {
    if (raw[k] instanceof CmzAtom) {
      // families can include pre-created atoms
      self._addAtom(k, raw[k])
    } else {
      // use the family key to make the classname a bit more descriptive
      self._addAtom(k, new CmzAtom(`${self._prefix}-${k}`, raw[k]))
    }
  })
}

CmzFamily.prototype._addAtom = function (key, atom) {
  // expose atoms directly (but warn if there's a name clash)
  if (this[key]) {
    console.warning(`CmzFamily: ${key} already exists`)
  }
  this[key] = this._atoms[key] = atom
}

// compose 2 families together
CmzFamily.prototype.compose = function (other) {
  const self = this
  Object.keys(other._atoms).forEach(k => {
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

CmzAtom.prototype.getCss = function () {
  // if no placeholder was given, wrap the entire thing in a selector
  if (this.raw.indexOf('&') === -1) {
    return `.${this.name} {
${this.raw}
}`
  }

  // otherwise replace the placeholder with the unique name
  return this.raw.replace(/&/g, `.${this.name}`)
}

CmzAtom.prototype.toString = function () {
  // need to call toString() on the comps first,
  // so that they appear higher in source
  const fullName = this.getFullName()
  upsertCss(this.name, this.getCss())
  return fullName
}

CmzAtom.prototype.getFullName = function () {
  return [this.name]
    .concat(this.comps)
    .filter(Boolean)
    .join(' ')
}

CmzAtom.prototype.compose = function (comps) {
  if (!Array.isArray(comps)) { comps = [comps] }
  this.comps = this.comps.concat(comps)
  return this
}

module.exports = cmz
