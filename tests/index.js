'use strict'

const tape = require('tape')
const cmz = require('../')

tape('compose', function (t) {
  t.test('Empty atom', (t) => {
    const atom = cmz('')
    t.equal(
      atom.toString(),
      'cmz-0',
      'An atom with no rules still gets a name'
    )

    t.end()
  })

  t.test('Empty with composition', (t) => {
    const atom = cmz('')
    atom.compose(['aa', 'bb'])
    t.equal(
      atom.toString(),
      'cmz-1 aa bb',
      'An atom with compositions but no rules still gets a name'
    )

    t.end()
  })

  t.test('Empty composition', (t) => {
    const atom = cmz('color: blue')
    const name = atom.name
    atom.compose('')
    t.equal(
      atom.toString(),
      name,
      'Empty composition means no changes')

    t.end()
  })

  t.test('Single composition', (t) => {
    const atom = cmz('overflow: hidden')
    const name = atom.name
    atom.compose('aa')
    t.equal(
      atom.toString(),
      `${name} aa`,
      'Classes are added together')

    t.end()
  })

  t.test('Multiple composition', (t) => {
    const atom = cmz(`
    @media (min-width: 400) {
      & { color: blue }
    } `)

    const name = atom.name
    atom.compose(['aa', 'bb'])
    t.equal(
      atom.toString(),
      `${name} aa bb`,
      'Classes are added together')

    t.end()
  })

  t.test('Nested composition', (t) => {
    const a1 = cmz('color: green').compose(['aa', 'bb'])
    const a2 = cmz('color: yellow').compose([a1, 'cc'])

    t.equal(
      a2.toString(),
      `${a2.name} ${a1.name} aa bb cc`,
      'Classes are added together')

    t.end()
  })
})
