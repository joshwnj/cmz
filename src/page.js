const renderCard = require('./components/card')

const card = renderCard({
  image: './assets/doge.png'
})

const html = `<!doctype html>
<html>
  <head>
    <title>cmz example</title>
  </head>
  <body>
    <div id="root">
      ${card}
    </div>
  </body>
</html>
`

if (!module.parent) {
  console.log(html)
}

module.exports = html
