(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const cmz = require('.')

module.exports = function (input) {
  return {
    className: cmz(input)
  }
}

module.exports.string = function (input) {
  return 'class="' + input + '"'
}

},{".":5}],2:[function(require,module,exports){
const cmz = require('cmz');
const attr = require('cmz/attr').string;

// you can define atoms that define common rules
const shadow = cmz('src_demo-5', /*cmz|*/'box-shadow: 1px 1px 5px #000'

// you can also create functions that return atoms
/*|cmz*/);const BASE_SIZE = 16;
const fontSize = size => cmz('src_demo-9', [
// cubic sizing
`font-size: ${size * size * size + BASE_SIZE}px`,

// big text will be condensed, smaller text is normal
size > 2 && `letter-spacing: -.07em`]);

const boxVariants = {
  small: cmz('src_demo-18', /*cmz|*/'color: lightseagreen' /*|cmz*/),
  medium: cmz('src_demo-19', /*cmz|*/'color: royalblue' /*|cmz*/),
  large: cmz('src_demo-20', /*cmz|*/'color: coral' /*|cmz*/)

  // you can create an atom by combining css rules:
};const box = cmz('box', [/*cmz|*/'width: 500px' /*|cmz*/, /*cmz|*/'margin: 20px auto' /*|cmz*/, /*cmz|*/'padding: 20px' /*|cmz*/,
// you can wrap an atom in a media query
cmz.widerThan(600, boxVariants.small), cmz.widerThan(800, boxVariants.medium), cmz.widerThan(1024, boxVariants.large)]

// you can also create an atom by composing existing atoms:
);const bigText = cmz('src_demo-35', [box, fontSize(3),
// you can take an existing atom and apply it with a pseudo-selector
cmz.pseudo('hover', require('./effects').pulse)]);

const medText = cmz('src_demo-42', [box, fontSize(2)]

// or a comnbination of the two
);const smallText = cmz('src_demo-48', [box, fontSize(1), /*cmz|*/'font-weight: 800' /*|cmz*/]

// and even just write some good old global css
// (it is applied to the document when we toString it)
);cmz('src_demo-56', /*cmz|*/`
body {
  padding: 0;
  margin: 0;
  background: azure;
}
` /*|cmz*/).toString();

module.exports = function (props) {
  return `
  <div ${attr(cmz('src_demo-66', [bigText, shadow]))}>big condensed text with a shadow</div>
  <div ${attr(medText)}>medium text</div>
  <div ${attr(smallText)}>small bold text</div>
`;
};

},{"./effects":3,"cmz":5,"cmz/attr":1}],3:[function(require,module,exports){
const cmz = require('cmz'

// you can define modules of atoms
);module.exports.shadow = cmz('src_effects-4', /*cmz|*/`
  box-shadow: 1px 1px 5px #000
` /*|cmz*/);

const makeItRed = cmz('src_effects-8', /*cmz|*/'& { color: red; }' /*|cmz*/);

module.exports.pulse = cmz('src_effects-10', [makeItRed, /*cmz|*/`
  & {
    animation: ? 1s infinite;
  }

  @keyframes ? {
    0% { opacity: 1; }
    50% { opacity: .5; }
  }
  ` /*|cmz*/]);

module.exports.spin = cmz('src_effects-24', /*cmz|*/`
  & {
    animation: ? 1s infinite linear;
  }

  @keyframes ? {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
` /*|cmz*/);

},{"cmz":5}],4:[function(require,module,exports){
const demo = require('./demo');
const html = demo();

if (!module.parent) {
  if (typeof document !== 'undefined') {
    document.getElementById('root').innerHTML = html;
  } else {
    console.log(html);
  }
}

if (module.hot) {
  module.hot.accept();
}

module.exports = html;

},{"./demo":2}],5:[function(require,module,exports){
const upsertCss = require('./lib/upsert-css')
const uniquifyName = require('./lib/uniquify-name')

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
    atom.comps.map(c => cmz.pseudo(type, c))
  )
}

cmz.widerThan = function (width, atom) {
  const name = atom.name + '-widerThan-' + width
  const css = renderCss(name, null, atom.raw)
  return new Atom(
    name,
    `
@media screen and (min-width: ${width}px) {
  ${css}
}
`
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

},{"./lib/uniquify-name":6,"./lib/upsert-css":7}],6:[function(require,module,exports){
var _names = { cmz: 0 }
module.exports = function uniquifyName (name) {
  name = name || 'cmz'
  var newName = name
  if (_names[name] !== undefined) {
    newName += '-' + _names[name]
    _names[name] += 1
  } else {
    _names[name] = 1
  }
  return newName
}
module.exports.reset = function () {
  _names = { cmz: 0 }
}

},{}],7:[function(require,module,exports){
const sheets = {}
const hasDoc = typeof document !== 'undefined'

function upsertCss (id, css) {
  if (!hasDoc) {
    sheets[id] = css
    return
  }

  const head = document.querySelector('head')
  var el = head.querySelector('style[data-cmz="' + id + '"]')

  if (!el) {
    el = document.createElement('style')
    el.setAttribute('type', 'text/css')
    el.setAttribute('data-cmz', id)
    head.appendChild(el)
  }

  if (el.styleSheet) {
    el.styleSheet.cssText = css
  } else {
    el.textContent = css
  }

  return el
}

upsertCss.sheets = sheets
module.exports = upsertCss

},{}]},{},[4]);
