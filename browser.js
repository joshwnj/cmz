function createClassname (baseToken, comps, name) {
  let compsForName = comps[name] || []
  if (typeof compsForName === 'string') {
    compsForName = [compsForName]
  }

  const token = baseToken + (name ? `__${name}` : '')
  return [token].concat(compsForName).join(' ')
}

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

module.exports.createClassname = createClassname
module.exports.upsertCss = upsertCss
