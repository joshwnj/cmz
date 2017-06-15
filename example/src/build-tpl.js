const cmz = require('cmz')
const fs = require('fs')
const path = require('path')

// ssr the frontend
const content = require('./index')

const sheets = cmz.sheets
const css = Object.keys(sheets).map((id) => sheets[id]).join('\n')

const dir = path.join(__dirname, '..', 'dist')
const cssFilename = 'bundle.css'
fs.writeFileSync(path.join(dir, cssFilename), css)

const tpl = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>cmz demo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="./${cssFilename}" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <div id="root">${content}</div>
    <script src="./bundle.js"></script>
  </body>
</html>`

fs.writeFileSync(path.join(dir, 'index.html'), tpl)
console.log('ok')
