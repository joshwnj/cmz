'use strict'

const tape = require('tape')
const cmz = require('../src')

tape('usage', function (t) {
  var result

  cmz.reset()
  result = cmz('color: red')
  t.equal(
    typeof result,
    'string',
    'cmz/1 creates and stringifies an atom'
  )

  t.equal(
    result.toString(),
    'cmz-0',
    'Unnamed atoms are given a sequential name'
  )

  result = cmz.named('myAtom', 'color: red')
  t.equal(
    result,
    'myAtom',
    'cmz.named creates a named atom'
  )

  t.end()
})
