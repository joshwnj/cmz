(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function createClassname (baseToken, comps, name) {
  let compsForName = comps[name] || []
  if (typeof compsForName === 'string') {
    compsForName = [compsForName]
  }

  return [`${baseToken}__${name}`].concat(compsForName).join(' ')
}

function upsertCss (id, css) {
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
}

module.exports.createClassname = createClassname
module.exports.upsertCss = upsertCss

},{}],2:[function(require,module,exports){

require('cmz').upsertCss('src/components/card/index.css', `.src_components_card_index__card {
  width: 200px;
  height: 300px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: -4px 4px 16px #999;
  background: #FFF;
}

.src_components_card_index__inner {
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -ms-flex-pack: distribute;
      justify-content: space-around;
  background: #EEE;
  border-radius: 4px;
}

.src_components_card_index__image {
  width: 80%;
}
`)

},{"cmz":1}],3:[function(require,module,exports){
const cmz = require('cmz')

// calling `cmz()` like this, with no arguments,
// means cmz will reference a css module with the
// corresponding name to this js module (aka index.css)
const styles = cmz.createClassname.bind(null, 'src_components_card_index', {})
require('/Users/josh/projects/css-modules/cmz/example/src/components/card/index.css')


// shortcut for creating a `class=""` attribute
const cl = require('../../util/cl')(styles)

module.exports = function (props) {
  return `
<div ${cl('card')}>
  <div ${cl('inner')}">
     <img ${cl('image')} src="${props.image}" />
  </div>
</div>
  `
}

},{"../../util/cl":6,"/Users/josh/projects/css-modules/cmz/example/src/components/card/index.css":2,"cmz":1}],4:[function(require,module,exports){
const cmz = require('cmz')

// when we provide a path in `cmz(...)` we can load
// a css module from somewhere else
const baseStyles = cmz.createClassname.bind(null, 'src_components_card_index', {})
require('/Users/josh/projects/css-modules/cmz/example/src/components/card/index.css')


// `cmz.inline(...)` means we can define css in the js module,
// without needing to split into separate files.
// This is useful if you have base classes and want to make a few alterations.
const styles = cmz.createClassname.bind(null, 'src_components_custom-card_index', {
  card: baseStyles('card'),
  inner: baseStyles('inner'),
  image: baseStyles('image')
})

require('cmz').upsertCss('src/components/custom-card/index.js', `
.src_components_custom-card_index__card {
  border-radius: 0;
}

.src_components_custom-card_index__image {
  -webkit-transform: rotate(-180deg);
          transform: rotate(-180deg);
  -webkit-transition: -webkit-transform 1s ease-in-out;
  transition: -webkit-transform 1s ease-in-out;
  transition: transform 1s ease-in-out;
  transition: transform 1s ease-in-out, -webkit-transform 1s ease-in-out;
}

.src_components_custom-card_index__card:hover .src_components_custom-card_index__image {
  -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
}
`)



// shortcut for creating a `class=""` attribute
const cl = require('../../util/cl')(styles)

module.exports = function (props) {
  return `
<div ${cl('card')}>
  <div ${cl('inner')}">
     <img ${cl('image')} src="${props.image}" />
  </div>
</div>
  `
}

},{"../../util/cl":6,"/Users/josh/projects/css-modules/cmz/example/src/components/card/index.css":2,"cmz":1}],5:[function(require,module,exports){
const card = require('./components/card')({
  image: 'src/assets/doge.png'
})

const customCard = require('./components/custom-card')({
  image: 'src/assets/doge.png'
})

const html = `
<div class="screen">
  <div class="inner">
    <h2>01. Basic Card</h2>
    <p>In <a href="https://github.com/joshwnj/cmz/blob/master/example/src/components/card/index.js"><code>src/components/card</code></a> we have a js module with a corresponding css module.</p>
    <p>When <code>cmz()</code> is called with no arguments, it assumes you want to load the css module that has the same name as the js module you're calling from.</p>

    ${card}
  </div>
</div>

<div class="screen">
  <div class="inner">
    <h2>02. Custom Card</h2>
    <p><a href="https://github.com/joshwnj/cmz/blob/master/example/src/components/custom-card/index.js"><code>src/components/custom-card</code></a> is just like the regular card, except with a few customisations.</p>
    <p>Rather than using the cascade to redefine base styles, we are composing from the base card classes and layering our own modifications on top. We don't need to create a whole new .css file in this case, since it's only a couple of lines so we inline it in our js component (using <code>cmz.inline(...)</code>).</p>
    <p>PS. hover the doge for a surprise</p>
    ${customCard}
  </div>
</div>
`

if (!module.parent) {
  if (typeof document !== 'undefined') {
    document.getElementById('root').innerHTML = html
  }
  else {
    console.log(html)
  }
}

if (module.hot) {
  module.hot.accept()
}

module.exports = html

},{"./components/card":3,"./components/custom-card":4}],6:[function(require,module,exports){
// shortcut for creating a `class=""` attribute
// for a css module
module.exports = function cl (styles) {
  return function (names) {
    if (typeof names === 'string') { names = [names] }
    return `class="${names.map(styles.bind(null)).join(' ')}"`
  }
}

},{}]},{},[5]);
