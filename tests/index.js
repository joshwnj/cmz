'use strict'

const tape = require('tape')
const cmz = require('../index.js')

tape('compose', function (t) {
  t.test('Empty composition', (t) => {
    const atom = cmz(``)
    const name = atom.name
    atom.compose('')
    t.equal(
      atom.toString(),
      name,
      'Empty composition means no changes')

    t.end()
  })

  t.test('Single composition', (t) => {
    const atom = cmz(``)
    const name = atom.name
    atom.compose('aa')
    t.equal(
      atom.toString(),
      `${name} aa`,
      'Classes are added together')

    t.end()
  })

  t.test('Multiple composition', (t) => {
    const atom = cmz(``)
    const name = atom.name
    atom.compose(['aa', 'bb'])
    t.equal(
      atom.toString(),
      `${name} aa bb`,
      'Classes are added together')

    t.end()
  })

  t.test('Nested composition', (t) => {
    const a1 = cmz(``).compose(['aa', 'bb'])
    const a2 = cmz(``).compose([a1, 'cc'])

    t.equal(
      a2.toString(),
      `${a2.name} ${a1.name} aa bb cc`,
      'Classes are added together')

    t.end()
  })
})
