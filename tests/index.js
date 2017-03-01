'use strict'

const tape = require('tape')
const cmz = require('../index.js')
const path = require('path')

tape('creating tokens', function (t) {
  const f = cmz.tokenFromRelFilename
  t.equals(f('abc'), 'abc')
  t.equals(f('abc/def'), 'abc_def')
  t.equals(f('abc/def/ghi.jk'), 'abc_def_ghi')

  t.end()
})

tape('abs filename', function (t) {
  const f = cmz.getAbsFilename

  t.equals(
    f(null, __filename),
    __filename.replace(/\.js$/, '.css'),
    'No input given: use caller filename')

  t.equals(
    f('.', __filename),
    __filename.replace(/\.js$/, '.css'),
    'Dot: use caller filename')

  t.equals(
    f('./foo.css', __filename),
    path.join(__dirname, 'foo.css'),
    'Relative path')

  t.equals(
    f('../foo.css', __filename),
    path.join(path.dirname(__dirname), 'foo.css'),
    'Backtracked relative path')

  t.end()
})

tape('transform', function (t) {
  const f = cmz.transform
  const res = f(`
.abc {}
.def {}
`, {
    baseToken: 'test'
  })

  t.equal(res.abc, 'test__abc')

  t.end()
})

tape('compose', function (t) {
  const f = cmz.compose
  t.deepEqual(
    f({ a: 'a', b: 'b' }, {}),
    { a: 'a', b: 'b' },
    'Empty composition means no changes')

  const orig = { a: 'a', b: 'b' }
  const expected = { a: 'a extra', b: 'b', c: 'new' }
  t.deepEqual(
    f(orig, { a: 'extra', c: 'new' }),
    expected,
    'Appends to existing items and adds new ones')

  t.deepEqual(
    orig,
    expected,
    'Modifies original')

  t.equal(
    f(orig, { c: ['and', 'more'] }).c,
    'new and more',
    'Compositions can be strings or array of strings')

  t.end()
})
