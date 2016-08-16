const renderCard = require('./components/card')

const card = renderCard({
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
    <h2>02. Next Example</h2>
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
