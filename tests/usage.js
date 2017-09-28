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
    'cmz/1 creates and stringifies an Atom when arg 1 looks like a rule'
  )

  t.equal(
    result.toString(),
    'cmz-0',
    'Unnamed atoms are given a sequential name'
  )

  result = cmz('myAtom', 'color: red')
  t.equal(
    result,
    'myAtom',
    'cmz/2 creates a named Atom when arg 2 looks like a rule'
  )

  t.end()
})
