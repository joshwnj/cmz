# cmz

[![Build Status](https://secure.travis-ci.org/joshwnj/cmz.png)](http://travis-ci.org/joshwnj/cmz)

**CSS Modules Zero:** A low-sugar variant of CSS Modules that runs in node and in the browser.

## Principles of CSS Modules

CSS Modules makes it easy to work with CSS classes that are:

- **immutable**: once we define a class its meaning should not change (ie. avoid cascading)
- **composeable**: compose single-purpose classes together (rather than overriding properties via cascading)
- **meaningful**: classes should be small and single-purpose, but not so small that their purpose becomes unclear.

## Design Goals

`cmz` differs from other CSS Modules implementations in the following areas:

- Runs in node & the browser without any additional tools.
- Easy to install and fast to build.
- Doesn't overload `require` / `import` for importing a CSS Module. We can do this with a normal js function call.
- Doesn't introduce new CSS syntax for composition and values. We can do this in javascript.

## How to get started

First add it to your project with `npm install cmz`

In your component `widget.js` you want to style with a CSS Module. Add this to the top:

```js
const cmz = require('cmz')

// Define a single class.
const myAmazingClass = cmz(`
  font-style: italic;
  color: magenta;
`)

// This is the equivalent of
//
//  .myAmazingClass {
//    font-style: italic;
//    color: magenta;
//  }

// Now you can use that class:
document.body.innerHTML = `<h1 class="${myAmazingclass}">cmz demo</h1>`

// The css is automatically added to the document's stylesheet.
```

### Pseudoselectors

If you want a class with a pseudoselector, we can use the `&` placeholder (which is replaced with the class's unique name):

```js
const classWithPseudos = cmz(`
& {
  color: magenta;
}

&:hover {
  color: cyan;
}
`)
```

### Composition

A useful pattern with CSS Modules is to define a library of common styles, and then compose them together.

```js
// typography.js

import cmz from 'cmz'

export default cmz('Typo', {
  bigText: `
    font-size: 48px;
    letter-spacing: .1rem;
    text-transform: uppercase;
  `,

  highlight: `
    color: cyan;
    font-weight: bold;
  `
})
```

```js
// heading.js

import cmz from 'cmz'
import typography from './typography.js'

const heading = cmz(`
  padding: 16px;
  border-bottom: 1px solid #000;
`).compose([
  typography.bigText,
  typography.highlight
])

export default function () {
  return `<h1 class="${heading}">cmz demo</h1>`
}

```

The `.compose` function doesn't mutate any styles, it only adds extra classes to the DOM element.

### Can `cmz` generate a `.css` file?

At the moment `cmz` adds all css to the page at runtime via a `<style>` tag. In a lot of cases this is fine, and will save you a network request as it's all bundled in the one `.js` file.

In future there will be a plugin that extracts this css out of the js bundle to a separate `.css` file. If that is important to you I'd love to help you make a PR :)

### Will `cmz` generate unique classnames?

Yes, this is an important part of the CSS Modules approach, so that we avoid accidental name collisions.

To get the most readable classnames in `cmz`, it's recommended to create "modules" rather than single classes, and provide a meaningful prefix. eg:

```js
const MyComponent = cmz('MyComponent', {
  heading: `
  ...
  `,

  mainImage: `
  ...
  `
})
```

This produces classes like `MyComponent__heading` and `MyComponent__mainImage`. It also will warn you if you try to create 2 modules with the same name. This fulfills the "classnames must be unique" constraint, and produces names that are very easy to read & debug from devtools.

So on one level it's doing the same thing as a naming convention (like BEM or SUIT) but in an easier & more automated way.

### Does `cmz` add vendor-prefixes?

Not yet, but it will soon :)

### Can I see an example of this?

Yes! There are still a few things to add, but you can see the WIP in the [example](https://github.com/joshwnj/cmz/tree/master/example) directory. Or view it online: <https://joshwnj.github.io/cmz/>

You can also [try it out on codepen](http://codepen.io/joshwnj/pen/zZNERK?editors=0010#0)

## Thanks

to the [CSS Modules team](https://github.com/orgs/css-modules/people)

## License

MIT
