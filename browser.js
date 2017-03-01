function upsertCss (id, css) {
  const head = document.querySelector('head')
  var el = head.querySelector('style[data-cmz="' + id + '"]')

  if (!el) {
    el = document.createElement('style')
    el.setAttribute('type', 'text/css')
    el.setAttribute('data-cmz', id)
    head.appendChild(el)
  }

  if (el.styleSheet) {
    el.styleSheet.cssText = css
  } else {
    el.textContent = css
  }

  return el
}

function compose (a, b) {
  Object.keys(b).forEach(function (k) {
    // a composition can be either a string, or an array of strings
    const comp = typeof b[k] === 'string' ? b[k] : b[k].join(' ')
    a[k] = a[k] ? `${a[k]} ${comp}` : comp
  })

  return a
}

module.exports.upsertCss = upsertCss
module.exports.compose = compose
