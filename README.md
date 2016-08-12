# cmz

**CSS Modules Zero:** A low-sugar variant of CSS Modules that runs in node and in the browser.

## Goals

- Run in node without any additional tools.
- Don't overload `require` / `import` for importing a CSS Module. We can do this with a normal js function call.
- Don't alter CSS syntax. We can do composition and values in javascript.

## How to get started

First add it to your project with `npm install cmz`

In your component `widget.js` you want to style with a CSS Module. Add this to the top:

```js
const cmz = require('cmz')

const styles = cmz()
```

And now you can style your widget with locally-scoped classnames from `widget.css`:

```js
module.exports = `
<div class="${styles('root')}">
  <div class="${styles('heading')}">...</div>
</div>
`
```

### What if my CSS is in a different file?

The usual assumption is that a `.js` file can have a corresponding `.css` file of the same base name.  But you can manually specify the CSS module to load:

```js
const styles = cmz('../shared/boxes.css')
```

### How do I compose classes?

Unlike traditional CSS Modules, `cmz` does not support the `composes:` keyword. Instead we do composition in javascript:

```js
const boxes = cmz('../shared/boxes.css')

const styles = cmz('widget.css', {
  root: [boxes('boxWithBorder'), 'someGlobalClass'],
  heading: 'globalHeadingClass'
})

console.log(styles('root'))
console.log(styles('heading'))
```

This will output:

```
"components_widget__root shared_boxes__boxWithBorder someGlobalClass"
"components_widget__heading globalHeadingClass"
```

### How do I use dynamic values from javascript?

`cmz` does not use the `@value` syntax like traditonal CSS Modules, instead we can just use javascript and define a CSS Module with `cmz.inline`:

```js
const colors = require('../shared/colors')
const niceRed = colors.niceRed

const styles = cmz.inline(`
.root {
  border: 1px solid ${niceRed};
  color: ${niceRed};
}
`)
```

## Thanks

to the [CSS Modules team](https://github.com/orgs/css-modules/people)

## License

MIT


