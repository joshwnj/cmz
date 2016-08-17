const cmz = require('cmz')

// when we provide a path in `cmz(...)` we can load
// a css module from somewhere else
const baseStyles = cmz('../card/index.css')

// `cmz.inline(...)` means we can define css in the js module,
// without needing to split into separate files.
// This is useful if you have base classes and want to make a few alterations.
const styles = cmz.inline('card', `
& {
  border-radius: 0;
}

.image {
  transform: rotate(-180deg);
  transition: transform 1s ease-in-out;
}

&:hover .image {
  transform: rotate(0deg);
}
`, {
  '': baseStyles(),
  inner: baseStyles('inner'),
  image: baseStyles('image')
})

// shortcut for creating a `class=""` attribute
const cl = require('../../util/cl')(styles)

module.exports = function (props) {
  return `
<div ${cl()}>
  <div ${cl('inner')}">
     <img ${cl('image')} src="${props.image}" />
  </div>
</div>
  `
}
