const upsertCss = require('./lib/upsert-css')
const createName = require('./lib/create-name')

function cmz (prefix, raw) {
  if (!raw) {
    raw = prefix
    prefix = createName()
  }

  if (typeof raw === 'string') { return new CmzAtom(prefix, raw) }
  if (typeof raw === 'object') { return new CmzMod(prefix, raw) }
}

function CmzMod (prefix, raw) {
  // we'll use the same prefix for all atoms in this family
  this._prefix = prefix || createName()
  this._atoms = {}
  if (raw) { this._addAtoms(raw) }
}

CmzMod.prototype.add = function (raw) {
  return this._addAtoms(raw)
}

CmzMod.prototype._addAtoms = function (raw) {
  const self = this
  Object.keys(raw).forEach(function (k) {
    if (raw[k] instanceof CmzAtom) {
      // families can include pre-created atoms
      self._addAtom(k, raw[k])
    } else {
      // use the family key to make the classname a bit more descriptive
      self._addAtom(k, new CmzAtom(self._prefix + '__' + k, raw[k]))
    }
  })
  return this
}

CmzMod.prototype._addAtom = function (key, atom) {
  // expose atoms directly (but warn if there's a name clash)
  if (this[key]) {
    console.warning('[cmz] %s already exists in module %s', key, prefix)
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

CmzAtom.prototype.getCss = function () {
  // if no placeholder was given, wrap the entire thing in a selector
  if (this.raw.indexOf('&') === -1) {
    return '.' + this.name + ' {\n' + this.raw + '\n}'
  }

  // otherwise replace the placeholder with the unique name
  return this.raw.replace(/&/g, '.' + this.name)
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
