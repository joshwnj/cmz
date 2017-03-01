const cmz = require('../index.js')
const tape = require('tape')

tape('e2e', function (t) {
  t.test('Loaded from file', function (t) {
    t.deepEqual(
      cmz(),
      {
        foo: 'tests_server__foo',
        bar: 'tests_server__bar',
        '@css': '.tests_server__foo {\n  color: #F00;\n}\n\n.tests_server__bar {\n  color: #BAA;\n}\n'
      })

    t.end()
  })

  t.test('Loaded from inline', function (t) {

    const color = '#F00'
    const styles = cmz.inline('styles', `
.foo {
  color: ${color};
}

.bar {
  color: #BAA;
}
`)

    t.deepEqual(
      styles,
      {
        foo: 'tests_server_styles__foo',
        bar: 'tests_server_styles__bar',
        '@css': '\n.tests_server_styles__foo {\n  color: #F00;\n}\n\n.tests_server_styles__bar {\n  color: #BAA;\n}\n'
      })

    t.end()
  })
})
