const renderCard = require('./components/card')

const card = renderCard({
  image: 'src/assets/doge.png'
})

const html = `
<h1>cmz example</h1>

basic card: ${card}
`

if (!module.parent) {
  if (typeof document !== 'undefined') {
    document.getElementById('root').innerHTML = html
  }
  else {
    console.log(html)
  }
}

module.exports = html
