const sheets = {}
const hasDoc = typeof document !== 'undefined'

function upsertCss (id, css) {
  if (!hasDoc) {
    sheets[id] = css
    return
  }

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

upsertCss.sheets = sheets
module.exports = upsertCss
