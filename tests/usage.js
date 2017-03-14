'use strict'

const tape = require('tape')
const cmz = require('../index.js')

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
    'cmz/2 creates an Atom when arg 2 looks like a rule'
  )

  t.equal(
    result.toString(),
    'myAtom',
    'Named atoms use the name they are given'
  )

  result = cmz('ModuleName')
  t.ok(
    result instanceof cmz.Mod,
    'cmz/1 creates a Module when arg 1 looks like a name'
  )

  result = cmz('ModuleName', {
    class1: 'color: red'
  })
  t.ok(
    result instanceof cmz.Mod,
    'cmz/2 creates a Module when arg 1 looks like a name'
  )

  result = cmz('ModuleName', {
    class1: [
      'aa',
      'bb',
      'color: red'
    ],
    class2: [
      'cc',
      'dd'
    ]
  })
  t.equal(
    result.class1.toString(),
    'ModuleName__class1 aa bb',
    'Module array syntax: compose names, create a class for rules'
  )
  t.equal(
    result.class2.toString(),
    'cc dd',
    'Module array syntax: only create a class if there\'s something to go in it'
  )

  t.end()
})
