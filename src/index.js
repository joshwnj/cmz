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
