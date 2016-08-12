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

tape('Main api', function (t) {
  const f = cmz

  t.equals(
    f()('abc'),
    'tests_index__abc',
    'No filename provided')

  t.equals(
    f('.')('abc'),
    'tests_index__abc',
    'Dot means current file')

  t.equals(
    f('./file/styles.css')('abc'),
    'tests_file_styles__abc',
    'Path to sub file')

  t.equals(
    f('../src/styles.css')('abc'),
    'src_styles__abc',
    'Backtrack to file')

  t.equals(
    f('../src/styles.css', { abc: ['def', 'ghi'] })('abc'),
    'src_styles__abc def ghi',
    'With composition')

  t.end()
})

tape('Inline api', function (t) {
  const f = cmz.inline

  t.equals(
    f()('abc'),
    'tests_index__abc',
    'No args provided')

  t.equals(
    f('', { abc: ['def', 'ghi'] })('abc'),
    'tests_index__abc def ghi',
    'With composition')

  t.end()
})
