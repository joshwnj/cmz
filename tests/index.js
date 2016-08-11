const tape = require('tape')
const cmz = require('../index.js')

tape('creating tokens', function (t) {
  t.equals(cmz.tokenFromRelFilename('abc'), 'abc')
  t.equals(cmz.tokenFromRelFilename('abc/def'), 'abc_def')
  t.equals(cmz.tokenFromRelFilename('abc/def/ghi.jk'), 'abc_def_ghi')

  t.end()
})
