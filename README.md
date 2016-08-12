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

## Thanks

to the [CSS Modules team](https://github.com/orgs/css-modules/people)

## License

MIT


