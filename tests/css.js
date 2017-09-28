'use strict'

const tape = require('tape')
const cmz = require('../src')

tape('css', function (t) {
  t.test('atom with multiple rules', t => {
    const a = new cmz.Atom('atom', [
      'a: 1',
      '&:hover { c: 3 }',
      'b: 2'
    ])

    t.equal(
      a.getCss(),
      '.atom {a: 1;\nb: 2}\n.atom:hover { c: 3 }'
    )

    t.end()
  })
})
