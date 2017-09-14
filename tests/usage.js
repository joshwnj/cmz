'use strict'

const tape = require('tape')
const cmz = require('../')

tape('usage', function (t) {
  var result

  cmz.reset()
  result = cmz('color: red')
  t.ok(
    result instanceof cmz.Atom,
    'cmz/1 creates an Atom when arg 1 looks like a rule'
  )

  t.equal(
    result.toString(),
    'cmz-0',
    'Unnamed atoms are given a sequential name'
  )

  result = cmz('myAtom', 'color: red')
  t.ok(
    result instanceof cmz.Atom,
    'cmz/2 creates a named Atom when arg 2 looks like a rule'
  )

  t.equal(
    result.toString(),
    'myAtom',
    'Named atoms use the name they are given'
  )

  t.end()
})
