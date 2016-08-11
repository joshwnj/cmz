const tape = require('tape')
const cmz = require('../index.js')

tape('creating tokens', function (t) {
  const f = cmz.tokenFromRelFilename
  t.equals(f('abc'), 'abc')
  t.equals(f('abc/def'), 'abc_def')
  t.equals(f('abc/def/ghi.jk'), 'abc_def_ghi')

  t.end()
})

tape('creating classnames', function (t) {
  let comps = {}
  const f = cmz.createClassname

  t.equals(
    f('abc', comps, 'def'),
    'abc__def',
    'Single classname')

  comps = {
    'a': 'b'
  }
  t.equals(
    f('abc', comps, 'def'),
    'abc__def',
    'No matching compositions')

  comps = {
    'a': 'b',
    'def': 'ghi'
  }
  t.equals(
    f('abc', comps, 'def'),
    'abc__def ghi',
    'One matching composition')

  comps = {
    'a': 'b',
    'def': ['ghi', 'jkl']
  }
  t.equals(
    f('abc', comps, 'def'),
    'abc__def ghi jkl',
    'Multiple matching compositions')

  t.end()
})
