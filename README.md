# cmz

[![Greenkeeper badge](https://badges.greenkeeper.io/joshwnj/cmz.svg)](https://greenkeeper.io/)

[![Build Status](https://secure.travis-ci.org/joshwnj/cmz.png)](http://travis-ci.org/joshwnj/cmz)

**CSS Modules Zero:** A low-sugar variant of CSS Modules that runs in node and in the browser.

## Example

- [take a look at the example](https://github.com/joshwnj/cmz/tree/master/example) or [view it online](https://joshwnj.github.io/cmz/)
- you can also [try it out on codepen](http://codepen.io/joshwnj/pen/zZNERK?editors=0010#0
)

## Principles of CSS Modules

CSS Modules makes it easy to work with CSS classes that are:

- **immutable**: once we define a class its meaning should not change (ie. avoid cascading)
- **composeable**: compose single-purpose classes together (rather than overriding properties via cascading)
- **meaningful**: classes should be small and single-purpose, but not so small that their purpose becomes unclear.

## Design Goals

`cmz` differs from other CSS Modules implementations in the following areas:

- Faster to install & build.
- Runs in node & the browser without any additional tools (but we can use a [babel plugin](https://github.com/joshwnj/babel-plugin-cmz-names) to enhance & optimise).
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

export const bigText = cmz(`
  font-size: 48px
  letter-spacing: .1rem
  text-transform: uppercase
`)

export const highlight = cmz(`
  color: cyan;
  font-weight: bold;
`)
```

```js
// heading.js

import cmz from 'cmz'
import typo from './typography'

const heading = cmz(`
  padding: 16px
  border-bottom: 1px solid #000
`).compose([
  typo.bigText,
  typo.highlight
])

export default function () {
  return `<h1 class="${heading}">cmz demo</h1>`
}
```

The `.compose` function doesn't mutate any styles, it only adds extra classes to the DOM element.

### Composition with pseudoselectors

Sometimes you have an atom that you want to compose, but within the scope of a pseudoselector. Traditionally, if you wanted to change the classes applied to an element on hover, you'd need to do that with javascript.

`cmz.pseudo` allows us to create new atoms from old ones that are wrapped in a pseudoselector.  For example:

```js
// say we've got an existing atom:
const pinkFancyText = cmz(`
  color: hotpink
  font-style: italic
`)

// but we only want our element to be pink and fancy when it is hovered:
const elemStyle = cmz(`
  width: 500px
`).compose(
  cmz.pseudo('hover', pinkFancyText)
)
```

### Will `cmz` generate unique classnames?

Yes, this is an important part of the CSS Modules approach, so that we avoid accidental name collisions.

### Can `cmz` generate a `.css` file?

Yes!

By default `cmz` adds all css to the page at runtime via a `<style>` tag. In a lot of cases this is fine, and will save you a network request as it's all bundled in the one `.js` file.

To extract css to a separate `.css` file (and result in a smaller `.js` bundle) there are 3 steps:

- create the js bundle as usual, with the [cmz-names](https://github.com/joshwnj/babel-plugin-cmz-names) babel plugin
- server-side-render your frontend, so that `cmz` can collect all of the necessary styles and write a `.css` file
- run the `cmz-min` script to trim the extracted css rules from your js bundle

To see this in action take a look at the [example](https://github.com/joshwnj/cmz/tree/master/example).

### Are animations automatically scoped?

By default, animations are left untouched. But you can create unique animation names by using the `?` placeholder. The animation will be created with the same base-name as the class:

```js
const fadeAnim = cmz(`
  & {
    animation: ? 1s infinite;
  }

  @keyframes ? {
    0% { opacity: 1; }
    50% { opacity: 0; }
  }
`)
```

Because the animation is coupled with a class, they can be applied as compositions, eg:

```js
const myFadingThing = cmz([
  'width: 50%',
  fadeAnim
])
```

### Does `cmz` add vendor-prefixes?

Not yet, but it will soon :) If this is important to you I'd love to help you make a PR :)

## Thanks

to the [CSS Modules team](https://github.com/orgs/css-modules/people)

## License

MIT
