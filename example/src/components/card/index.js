const cmz = require('cmz')

const styles = cmz('Card', {
  root: `
    width: 200px;
    height: 300px;
    padding: 16px;
    border-radius: 12px;
    box-shadow: -4px 4px 16px #999;
    background: #FFF;
`,
  inner: `
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #EEE;
    border-radius: 4px;
`,
  image: `
    width: 80%;
`
})

module.exports = function (props) {
  return `
<div class="${styles.root}">
  <div class="${styles.inner}">
     <img class="${styles.image}" src="${props.image}" />
  </div>
</div>
  `
}

module.exports.styles = styles
